# CVS
CERTIFICATE VERIFICATION AND STORAGE SYSTEM

#Group Members - Aditya (18111003), Ankit (18111005), Deepak (18111014), Deepak (18111015), Somesh (18111072)


#Set Up
	o Run "npm install" command in both directories,
		1. /fabric-dev-servers/dadas-cerver/WEBAPPS/ADMINWEBAPP/
		2. /fabric-dev-servers/dadas-cerver/WEBAPPS/USERWEBAPP/
	o To start all hyperledger and webportals
		chmod +700 restart.sh
		run "./restart.sh" located in /fabric-dev-servers/dadas-cerver

There are two portals 
	1. admin portal on "http://localhost:4200"
	2. user portal on "http://localhost:5200"		

	Admin can make certificate type and add endorsers and give user the ability to upload and endorse certificate.

	User can login using github and then can use the platform.

#STEPS for 1 certificate upload and verification
	o create one organization from AdminPortal.
	o create users from user portal.
	o Then create CertificateType from AdminPortal
		- Assign few users as endorsers of that CertificateType from AdminPortal(atleast as minRequiredEndorsers for that CertificateType).
		- And give few user permissions for uploadingCertificate from AdminPortal.
	o Then Uploader(who's canUpload field is true) can upload certificate
	o And then Holder and Endorser should endorse to make certificate valid.
	o Then Certificate can be verified from homepage VerifyCertificate Button.
