import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.dadas.cerver{
   export class Certificate extends Asset {
      certificateHash: string;
      description: string;
      url: string;
      valid: boolean;
      type: CertificateType;
      issuer: Organization;
      holder: User;
      uploader: User;
      endorsers: User[];
   }
   export class CertificateType extends Asset {
      id: string;
      endorsers: User[];
      minEndorsementRequired: number;
      name: string;
   }
   export class User extends Participant {
      userId: string;
      name: string;
      canUpload: boolean;
      allowedEndorsableTypes: CertificateType[];
   }
   export class Organization extends Participant {
      orgId: string;
      name: string;
   }
   export class PublishCertificate extends Transaction {
      certificate: Certificate;
      issuer: Organization;
   }
   export class Endorse extends Transaction {
      certificate: Certificate;
      endorser: User;
   }
   export class _demoSetup extends Transaction {
   }
// }
