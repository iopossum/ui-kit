import { getUserCertificates, createDetachedSignature, createHash } from 'crypto-pro';
import type { CadesCertificate } from 'crypto-pro';
import { pick } from 'lodash-es';

declare global {
  interface Window {
    cadesplugin: CadesCertificate;
  }
}

export interface ICertificate {
  cert: CadesCertificate;
  certFromDate: InstanceType<typeof Date>;
  certToDate: InstanceType<typeof Date>;
  sng: string;
  thumbprint: string;
  serialNumber: string;
  subjectName: string;
  certBase64: string;
  cn?: string;
  ogrn?: string;
}

export interface ICertificateListItem {
  id: string;
  title: string;
  certificate: ICertificate;
}

interface ICertConstructor {
  new (props: ICertificate): ICertificate & ICertPrototype;
  (): void;
}

interface ICertPrototype {
  check(digit: number): string;
  checkQuotes(str: string): boolean;
  extract(from: string, what: string): string;
  dateTimePutTogether(certDate: Date): string;
  getCertString(): string;
  getCertFromDate(): string;
  getCertToDate(): string;
}

const getCertSng = (subjectName: string) => {
  return [Certificate.prototype.extract(subjectName, 'SN='), Certificate.prototype.extract(subjectName, 'G=')]
    .filter((v) => !!v)
    .join(' ');
};

const Certificate = function (this: ICertificate & ICertPrototype, props: ICertificate) {
  Object.assign(this, props);
} as ICertConstructor;

Certificate.prototype.check = function (digit) {
  return digit < 10 ? '0' + digit : digit;
} as ICertPrototype['check'];

Certificate.prototype.checkQuotes = function (str) {
  let result = 0,
    i = 0;
  for (i; i < str.length; i++) if (str[i] === '"') result++;
  return !(result % 2);
} as ICertPrototype['checkQuotes'];

Certificate.prototype.extract = function (this: ICertificate & ICertPrototype, from, what) {
  let certName = '';

  const begin = from.indexOf(what);

  if (begin >= 0) {
    let end = from.indexOf(', ', begin);
    while (end > 0) {
      if (this.checkQuotes(from.substr(begin, end - begin))) break;
      end = from.indexOf(', ', end + 1);
    }
    certName = end < 0 ? from.substr(begin) : from.substr(begin, end - begin);
  }

  certName = certName.replace(what, '');

  return certName;
} as ICertPrototype['extract'];

Certificate.prototype.dateTimePutTogether = function (this: ICertificate & ICertPrototype, certDate) {
  return (
    this.check(certDate.getUTCDate()) +
    '.' +
    this.check(certDate.getUTCMonth() + 1) +
    '.' +
    certDate.getFullYear() +
    ' ' +
    this.check(certDate.getUTCHours()) +
    ':' +
    this.check(certDate.getUTCMinutes()) +
    ':' +
    this.check(certDate.getUTCSeconds())
  );
} as ICertPrototype['dateTimePutTogether'];

Certificate.prototype.getCertString = function (this: ICertificate & ICertPrototype) {
  return (this.sng || this.cn) + '; Выдан: ' + this.getCertFromDate();
} as ICertPrototype['getCertString'];

Certificate.prototype.getCertFromDate = function (this: ICertificate & ICertPrototype) {
  return this.dateTimePutTogether(this.certFromDate);
} as ICertPrototype['getCertFromDate'];

Certificate.prototype.getCertToDate = function (this: ICertificate & ICertPrototype) {
  return this.dateTimePutTogether(this.certToDate);
} as ICertPrototype['getCertToDate'];

Certificate.prototype.getPubKeyAlgorithm = async function (this: ICertificate & ICertPrototype) {
  return await this.cert.PublicKey().Algorithm.FriendlyName;
};

Certificate.prototype.getCertName = async function (this: ICertificate & ICertPrototype) {
  return this.extract(await this.cert.SubjectName, 'CN=');
};

Certificate.prototype.getIssuer = async function (this: ICertificate & ICertPrototype) {
  return this.extract(await this.cert.IssuerName, 'CN=');
};

Certificate.prototype.getPrivateKeyProviderName = async function (this: ICertificate & ICertPrototype) {
  return await this.cert.PrivateKey.ProviderName;
};

Certificate.prototype.getPrivateKeyLink = async function (this: ICertificate & ICertPrototype) {
  return await this.cert.PrivateKey.UniqueContainerName;
};

Certificate.prototype.toJSON = function (this: ICertificate & ICertPrototype) {
  return pick(this, ['certFromDate', 'certToDate', 'cn', 'sng', 'thumbprint', 'serialNumber']);
};

export const getCertificates = async (): Promise<ICertificateListItem[]> => {
  if (!window.cadesplugin) {
    throw new Error('Не установлен плагин');
  }
  const certificates = await getUserCertificates();
  if (!certificates.length) {
    throw new Error('Не доступен ни один сертификат. Используйте рутокен или установите сертификат на компьютер');
  }

  const result: ICertificateListItem[] = [];
  for (const cert of certificates) {
    const certBase64 = await cert.exportBase64();
    const serialNumber = await cert.getCadesProp('SerialNumber');
    const certificate = new Certificate({
      cert,
      certFromDate: new Date(cert.validFrom),
      certToDate: new Date(cert.validTo),
      cn: Certificate.prototype.extract(cert.subjectName, 'CN='),
      sng: getCertSng(cert.subjectName),
      thumbprint: cert.thumbprint,
      serialNumber,
      subjectName: cert.subjectName,
      ogrn:
        Certificate.prototype.extract(cert.subjectName, 'ОГРН=') ||
        Certificate.prototype.extract(cert.subjectName, 'OGRN='),
      certBase64,
    });

    result.push({
      id: serialNumber || cert.validFrom,
      title: certificate.getCertString(),
      certificate,
    });
  }

  return result.sort((a, b) => a.title.localeCompare(b.title));
};

export const sign = async (cert: ICertificate, data: string | Record<string, unknown>): Promise<string> => {
  if (!window.cadesplugin) {
    throw new Error('Не установлен плагин');
  }
  const message = typeof data === 'string' ? data : btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const messageHash = await createHash(message);
  const signature = await createDetachedSignature(cert.thumbprint, messageHash);
  return signature;
};
