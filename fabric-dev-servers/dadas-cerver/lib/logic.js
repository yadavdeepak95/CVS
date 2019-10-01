/**
 * Track the trade of a commodity from one trader to another
 * @param {org.dadas.cerver.Endorse} endorse - the trade to be processed
 * @transaction
 */
async function endorseCertificate(endorse) {
  	let certificateRegistry = await getAssetRegistry('org.dadas.cerver.Certificate');
  	let certificate = await certificateRegistry.get(endorse.certificate.getIdentifier());
  	if(!certificate) {
    	throw new Error('Certificate not found.');
    }
  	console.log(certificate);
  
  	let userRegistry = await getParticipantRegistry('org.dadas.cerver.User');
  	let endorser = await userRegistry.get(endorse.endorser.getIdentifier());
  	if(!endorser) {
    	throw new Error('endorser not found.');
    }
  	console.log(endorser);
  
  	let certificateTypeRegistry = await getAssetRegistry('org.dadas.cerver.CertificateType');
  	let certificateType = await certificateTypeRegistry.get(certificate.type.getIdentifier());
  	console.log(certificateType);
  
  	let isEndorserHolder = (endorser.getIdentifier() == certificate.holder.getIdentifier());
  	let canEndorse = false || isEndorserHolder;
  	console.log(certificateType.endorsers);
  	if(!canEndorse) {
      certificateType.endorsers.forEach(curEndorser => {
          canEndorse = canEndorse || (curEndorser.getIdentifier() == endorser.getIdentifier());
      });
    }
  	if(!canEndorse) {
    	throw new Error('Cannot Endorse.');
    }
  
  	let alreadyEndorse = false;
  	if(certificate.endorsers) {
      certificate.endorsers.forEach(curEndorser => {
          alreadyEndorse = alreadyEndorse || (curEndorser.getIdentifier() == endorser.getIdentifier());
      });
    } else {
    	certificate.endorsers = [];
    } 	
  	if(alreadyEndorse) {
    	throw new Error('Already Endorse.');
    }

  	certificate.endorsers.push(endorser);
  	if(certificate.endorsers.length >= certificateType.minEndorsementRequired) {
      	let hasHolderEndorse = false || isEndorserHolder;
      	if(!hasHolderEndorse) {
          certificateType.endorsers.forEach(curEndorser => {
            hasHolderEndorse = hasHolderEndorse || (curEndorser.getIdentifier() == certificate.holder.getIdentifier());
          });
        }
        if(hasHolderEndorse) {
            certificate.valid = true;
        }
    	
    }
 	await certificateRegistry.update(certificate);
}

//certifictaeTypeID
