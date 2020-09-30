const CADESCOM_CADES_BES = 1;
const CAPICOM_CURRENT_USER_STORE = 2;
const CAPICOM_MY_STORE = "My";
const CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
const CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
const CADESCOM_CADES_X_LONG_TYPE_1 = 0x5d;

function Certificate({cert, certFromDate, certToDate, cn, sng, thumbprint}) {
    this.cert = cert;
    this.certFromDate = new Date(certFromDate);
    this.certToDate = new Date(certToDate);
    this.cn = cn;
    this.sng = sng;
    this.thumbprint = thumbprint;
}

Certificate.prototype.check = function(digit) {
    return (digit<10) ? "0"+digit : digit;
};

Certificate.prototype.checkQuotes = function(str) {
    var result = 0, i = 0;
    for(i;i<str.length;i++)if(str[i]==='"')
        result++;
    return !(result%2);
};

Certificate.prototype.extract = function(from, what) {
    let certName = "";

    var begin = from.indexOf(what);

    if(begin>=0)
    {
        var end = from.indexOf(', ', begin);
        while(end > 0) {
            if (this.checkQuotes(from.substr(begin, end-begin)))
                break;
            end = from.indexOf(', ', end + 1);
        }
        certName = (end < 0) ? from.substr(begin) : from.substr(begin, end - begin);
    }

    certName = certName.replace(what, '');

    return certName;
};

Certificate.prototype.DateTimePutTogether = function(certDate) {
    return this.check(certDate.getUTCDate())+"."+this.check(certDate.getUTCMonth()+1)+"."+certDate.getFullYear() + " " +
                 this.check(certDate.getUTCHours()) + ":" + this.check(certDate.getUTCMinutes()) + ":" + this.check(certDate.getUTCSeconds());
};

Certificate.prototype.GetCertString = async function() {
    return this.extract(await this.cert.SubjectName, 'CN=') + "; Выдан: " + this.GetCertFromDate();
};

Certificate.prototype.GetCertFromDate = function() {
    return this.DateTimePutTogether(this.certFromDate);
};

Certificate.prototype.GetCertToDate = function() {
    return this.DateTimePutTogether(this.certToDate);
};

Certificate.prototype.GetPubKeyAlgorithm = async function() {
    return await this.cert.PublicKey().Algorithm.FriendlyName;
};

Certificate.prototype.GetCertName = async function() {
    return this.extract(await this.cert.SubjectName, 'CN=');
};

Certificate.prototype.GetIssuer = async function() {
    return this.extract(await this.cert.IssuerName, 'CN=');
};

Certificate.prototype.GetPrivateKeyProviderName = async function() {
    return await this.cert.PrivateKey.ProviderName;
};

Certificate.prototype.GetPrivateKeyLink = async function () {
    return await this.cert.PrivateKey.UniqueContainerName;
};

export const getCertificates = () => {
  return new Promise((resolve, reject) => {
    if (!cadesplugin) {
      return reject({pluginEnabled: false, message: 'Не установлен плагин'});
    }
    cadesplugin.then(async function () {
      try {
        const oStore = await cadesplugin.CreateObjectAsync("CAdESCOM.Store");
        await oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
        const CertificatesObj = await oStore.Certificates;
        const count = await CertificatesObj.Count;
        if (!count) {
          return reject({empty: true, message: 'Не доступен ни один сертификат. Используйте рутокен или установите сертификат на компьютер'});
        }
        let result = [];
        for (let i = 1; i <= count; i++) {
          try {
            const cert = await CertificatesObj.Item(i);
            const subjectName = await cert.SubjectName;
            let sn = Certificate.prototype.extract(subjectName, 'SN=');
            let g = Certificate.prototype.extract(subjectName, 'G=');
            if (sn && g) {
              sn = `${sn} ${g}`;
            }
            const certificate = new Certificate({
              cert,
              certFromDate: await cert.ValidFromDate,
              certToDate: await cert.ValidToDate,
              cn:  Certificate.prototype.extract(subjectName, 'CN='),
              sng: sn,
              thumbprint: await cert.Thumbprint
            });

            result.push({id: i, title: await certificate.GetCertString(), certificate});
          } catch (ex) {
            reject({message: "Ошибка при перечислении сертификатов: " + cadesplugin.getLastError(ex)});
            break;
          }
        }
        resolve(result);
        await oStore.Close();
      } catch (e) {
        reject({message: cadesplugin.getLastError(e)});
      }
    }, (error) => {
       reject(error);
    });
  });
};

export const sign = (cert, data) => {
  return new Promise((resolve, reject) => {
    if (!cadesplugin) {
      return reject({pluginEnabled: false, message: 'Не установлен плагин'});
    }
    cadesplugin.then(async function () {
      try {
        const oSigner = await cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
        oSigner.propset_Certificate(cert);
        // oSigner.propset_TSAAddress("http://cryptopro.ru/tsp/");

        const oSignedData = await cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
        oSignedData.propset_Content(JSON.stringify(data));
        const sSignedMessage = await oSignedData.SignCades(oSigner, CADESCOM_CADES_BES);
        resolve(sSignedMessage);
      } catch (e) {
        reject({message: cadesplugin.getLastError(e)});
      }
    }, (error) => {
       reject(error);
    });
  });
};
