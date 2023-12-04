import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {

  privacyList: any;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    this.setUpPrivacyList();
  }

  back() {
    this.navCtrl.pop();
  }

  setUpPrivacyList() {
    this.privacyList = [
      {
        subtitle: `Welcome to register Vouchy account and use Vouchy service!`,
        content: [
          `Vouchy (hereinafter referred to as "we") attaches great importance to
          protecting the personal information and privacy of users (" you "). We
          know very well the importance of personal information to you and will
          take corresponding security protection measures to protect your personal
          information in accordance with the requirements of laws and regulations
          and the mature security standards of the industry. We hope that this
          privacy policy can clearly introduce to you how we handle your personal
          information when using our products and services, and the ways we provide
          to you to access, correct, delete and protect such information.`,
          `[special note] please carefully read and fully understand this privacy
          policy before using our various products and services and make
            corresponding choices. By using or continuing to use our products
            and services, you agree that we will process your information in
            accordance with this privacy policy.`,
          `If you have any questions about this privacy policy, you can contact us
          through the contact information provided on Vouchy website.`,
          `This privacy policy applies to all products/services provided by
          Vouchy (including products/services provided by Vouchy and products/services
            provided by Vouchy affiliates without an independent privacy policy).`,
          `"Vouchy on products/services" refers to the Vouchy on network and technical
            service providers to provide you with products/services through the following
            way: including but not limited to Vouchy.`,
          `In addition, we will develop a specific privacy policy for certain products/services
            and explain before we provide you with these specific products/services.
            If there is any inconsistency between the specific privacy policy and
            this privacy policy, the specific privacy policy shall apply.`,
          `Please note that this policy does not apply to other third party products/services
            that you access through our products/services (" other third party "includes but is
            not limited to the other party of your transaction, any third party website and
            third party service provider). Please refer to the privacy policy or similar statement
            of such third party for specific provisions.`,
        ]
      },
      {
        subtitle: `I. How do we collect and use your personal information`,
        content: [
          `We will follow the principle of due, legal and necessary to collect and
          use the personal information you proactively provide or generate in the
          process of using the service for the following purposes stated in this policy:`
        ]
      },
      {
        subtitle: `(a) To help you become our users`,
        content: [
          `In order to comply with the requirements of laws and regulations, and provide
          you with more personalized and more convenient services, when you register as
          a Vouchy user, you need to provide at least your mobile phone number to create
          Vouchy account, and improve relevant network identity information (such as
            avatar, username and login password, etc.); If you only need to browse,
            search and other functions, you do not need to register as our user and
            provide the above information.`,
          `In the process of providing account information, if you are willing to add the
          following personal information, it will help us to provide you with more personalized
          services: including your gender, birthday, usual residence, hometown, preferences,
          family information, etc. If you do not provide such information, you will not be
          affected by the Vouchy service to enjoy the basic functions.`
        ]
      },
      {
        subtitle: `1. The personal information you provided to us`,
        content: [
          `Booking \ order: you made a reservation in Vouchy on \ order food, and other services,
          you may need to provide contact information (name, gender, telephone number, etc.)
          and service preferences (e.g. as the number of meals), etc.`,
          `Information release: when you proactively evaluate the products/services of merchants
          or publish other content (such as sharing mood, status, check-in and other information)
          on Vouchy, we will collect the information you post and display your username, avatar
          and published content. If you choose to post comments anonymously, we will not display
          your nickname or avatar. You can also authorize Vouchy to access your camera, photos
          and microphone by actively uploading pictures, video and other means, so that you can
          publish content by taking photos, taking video, uploading photos or uploading video.
          When you need to turn this feature off, most mobile devices will support this
          requirement. Please refer to or contact the service provider or manufacturer of
          your mobile device for details.`,
          `Payment: when you make payment on Vouchy, you can choose the payment service provided
          by Vouchy or the third-party payment institutions cooperating with Vouchy
          (such as Boost, MCash and other payment channels). The payment function itself
          does not collect your personal information, but we need to share your Vouchy
          order information and reconciliation information with these payment institutions
          to confirm your payment instructions and complete the payment.`,
          `Customer service: when you get in touch with our customer service, our system
          may record the communication record between you and customer service, and use
          your account information for verification of identity; When you need us to
          provide customer service related to your order, we may query your relevant
          order information to give you appropriate help and processing; When you need
          customer service to help you modify relevant information (such as delivery address,
            contact information, etc.), you may need to provide other information in addition
            to the above information to complete the modification.`,
          `You can order all kinds of products and services for others through Vouchy, and
          provide information about the recipient of the actual service, please make sure
          that you have obtained the authorization of the relevant person.`,
          `In order to display the order information of your account, we will collect the
          order information generated during the use of our service to display and facilitate
          your order management.`,
          `Generated on Vouchy on your order, would be likely to contain your identity
          information, contact information, payment information, etc., these all belong to
          sensitive information, please carefully to show others or provide, we will also
          show in the order information, on the basis of guarantee the information availability
          as far as possible to identify.`,
        ]
      },
      {
        subtitle: `2. Personal information that we may collect during your use of the service`,
        content: [
          `In order to meet the basic requirements of laws and regulations and provide services
          and ensure the security of your account and system operation, we will collect
          relevant information generated during your use of our services, including:`,
          `(I) Log information. When you use the product we provide \ service, we automatically
          collect your use of our service details, and as the web logs of preservation,
          including but not limited to your IP address, browser type, the use of language,
          operating system version, access date and time, and the information such as the page
          you request.`,
          `(II) Location information. In order to facilitate you to find the information of catering,
          shopping malls, and other services around you, we will provide services (LBS) based on
          your geographical location. When you open the equipment function and use our LBS,
          we may collect and use your location information, in order to achieve the purpose
          of our services to provide you with the local surrounding life (if you don't need
          to manually enter their geographic location can obtain related services, and the
          actual distance between estimate business with you for a consumer decision-making,
          etc.). We will use technologies such as IP addresses, GPS, and sensor technologies
          such as wi-fi access points, bluetooth, and base stations to determine your actual location.`,
          `Please note, most mobile devices allows you to close location services, specific methods
          suggest you reference or contact your service provider or mobile device manufacturers,
          once you have closed by a system of authorization positioning function, to stop our
          collection of location information to you, you may not be able to use our service
          based on geographical position to provide you with, or related services can't achieve
          the desired effect.`,
          `(III) Equipment information. We may receive and record relevant device information,
          such as device model, unique device identifier, operating system, resolution, telecom
          operator and other software and hardware information, according to your specific
          permissions in software installation and use.`,
          `We may associate information collected from you logging into various devices using
          the same Vouchy account so that we can provide you with consistent services on these devices.`
        ]
      },
      {
        subtitle: `3. We may indirectly collect your personal information`,
        content: [
          `To provide you with more high quality service, at the same time to confirm the
          transaction status and provide after-sale with the dispute resolution service for you,
          we will pass after you authorize you to select the transaction object and directly related
          to third party information system, pay the agency collection related to transaction
          schedule your trading, payment, ticket information, so that we are dealing with your order
          and to ensure that the service is completed, or better prevent malicious behavior such
          as identity fraud, brush list. In accordance with the requirements of laws and regulations
          and the agreement with a third party, we will, upon your authorization, obtain your
          relevant information from Vouchy's affiliated parties and partners, and confirm the
          legitimacy of their information sources before using your information.`,
          `If you are authorized to log in with a third party account, we will obtain your Shared
          account information (such as avatar, nickname, etc.) from a third party, and bind your
          third party account to Vouchy account after you agree to this privacy policy.`,
        ]
      },
      {
        subtitle: `4. Improve our products and services`,
        content: [
          `In order to maintain and improve the quality of our products or services and provide
          you with personalized services, we may collect and use the following information in
          accordance with laws and under your specific authorization:`,
          `1. We may collect your order information, browse and search information, behavior
          preference (if you provide us with location information, etc., and will you use a service
            on Vouchy on the information from the information in the other services combined with
            comprehensive statistics and analysis in order to form the user, to recommend to you
            or show you might be interested in products, service information, or through the
            system shows you individualized third-party promotion information. This includes
            pushing message notifications to you on the App page, providing you with intelligent
            recommendations and sending you promotional messages.`,
          `If you do not want to accept our intelligent recommendation service, you can choose
          to sort by distance, praise, price, etc. If you do not want to receive the promotional
          messages we send you, you can unsubscribe through the corresponding unsubscribe function
          in the message. When you choose to exit the directional push, you can delete your personal
          information according to the path of deleting your personal information in part 5 of
          this privacy policy.`,
          `2. We may collect the information you proactively provided to us when you participated
          in the product/service investigation, as well as the relevant information you provided
          during the interaction with our affiliated parties and partners, so as to facilitate
          you to track the order status, initiate user complaints and optimize the quality and
          process of customer service.`,
          `3. We may use the personal information collected in our business for statistical
          analysis and operation improvement, such as statistical analysis of your location and
          preference, so as to improve our products, services or marketing plans; For example,
          technical transformation, network maintenance, troubleshooting, formulation of internal
          policies and procedures, and generation of internal reports to improve our system.`,
        ]
      },
      {
        subtitle: `5. Provide you with security protection`,
        content: [
          `To enhance the security of your use of the services we offer, the more accurate to
          prevent fraud and trojans, viruses, phishing site we may use or integration of your
          personal information, and our affiliates, partners get your authorization or Shared
          information in accordance with the law, according to your habits and common software
          information and so on comprehensive judgment of your account and the transaction risk,
          including authentication, possible fraud prevention, detection, investigation, network
          virus, network attack, such as security risks, and against our or related parties
          agreement, policies or rules, etc, in order to protect you, the legitimate rights and
          interests of other users, we or affiliated parties, Keep track of any links (" urls ")
          that we consider risky.`
        ]
      },
      {
        subtitle: `Other purposes`,
        content: [
          `We will seek your authorization and consent separately when we use the information for
          other purposes not specified in this policy, or when we use the information collected
          for other purposes.`,
          `(vi) Please note that we do not need your authorization and consent to collect and use
          personal information in the following situations`,
          `1. Those related to national security and national defense security;`,
          `2. Those related to public safety, public health and major public interests;`,
          `3.  Relating to criminal investigation, prosecution, trial and execution of judgment;`,
          `4. For the purpose of protecting the life, property and other significant legal rights
          and interests of the subject of personal information or other individuals, but it is difficult
          to get the consent of the subject;`,
          `5. The personal information collected is disclosed to the public by the subject of
          personal information;`,
          `6. Your personal information collected from legally disclosed information, such as legal
          news reports, government information disclosure and other channels;`,
          `7. It is necessary to sign the contract according to your requirements;`,
          `8. It is necessary to maintain the safe and stable operation of the products and/or services provided,
          such as finding and disposing of faults of the products and/or services;`,
          `9. Necessary for legal news reporting;`,
          `10. When it is necessary for an academic research institution to carry out statistics or
          academic research on the basis of public interests and provide the results of academic
          research or description to the public, it shall de-label the personal information contained
          in the results;`,
          `11. Other circumstances stipulated by laws and regulations.`,
          `Please note that data that cannot be directly linked to any particular individual is not
          personal information. If we combine data that cannot be linked to any particular individual
          with other information for the purpose of identifying a natural person's personal identity
          or use it in combination with personal information, such information will be considered as
          personal information during the combined use.`
        ]
      },
      {
        subtitle: `(I) Use of cookies`,
        content: [
          `In order to ensure the normal and efficient operation of the website, to provide you with a
          more relaxed access experience, and to recommend to you the content that you may be
          interested in, we will store a small data file named Cookie on your device terminal \
          system. Cookie will help you call your information when you visit our website later,
          and simplify the process of filling in your personal information (such as one-click login,
            etc.); Provides you with security shopping preferences; Help you optimize your advertising
            choices and interactions; Protect your data security, etc. We do not use cookies for any
            purpose other than those described in this privacy policy. You can manage or delete
            cookies according to your preferences. You can clear all cookies saved on your computer
            or mobile device, and you have the right to accept or reject cookies. Most browsers accept
            cookies automatically, but you can usually modify your browser Settings to reject cookies
            as you see fit. Alternatively, you can clear all cookies stored in the software. But you
            may not be able to fully experience some of our convenience and security services.`
        ]
      },
      {
        subtitle: `(II) Sharing`,
        content: [
          `1. We will not share your personal information with any company, organization or individual
          other than Vouchy, except as follows:`,
          `(1) Obtain your express consent or authorization in advance;`,
          `(2) Based on the legal situation: according to the provisions of laws and regulations,
          the need for litigation dispute resolution, or the requirements of administrative,
          judicial and other authorities in accordance with the law;`,
          `(3) Sharing with affiliated parties: in order to provide you with consistent services
          and facilitate your unified management, we may share your personal information with our
          affiliated parties. However, we will only share necessary personal information. If we
          share your sensitive personal information or the related party changes the purpose of
          using personal information, we will seek your authorization and consent again.`,
          `(4) Sharing with partners: we may share order information, account information,
          payment information and other information necessary for your services with our business
          partners. Our business partners include the following types:`,
          `Item supplier service provider. For the purposes stated in this policy only, some of
          our services will be provided by our business partners. To ensure the smooth completion
          of the services provided for you, we may share your personal information with the
          above partners, including distribution business, technical services, payment services,
          financial services, etc. This may include your contact information, order information,
          payment information, etc., to ensure the smooth completion of the service you provide.
          For example, when you use our delivery service, we must share your order and delivery
          information with the delivery service provider to ensure the safe and accurate delivery
          of the order. For another example, we need to share your order number and order amount
          with the third-party payment institution to confirm your payment order and complete
          the payment.`,
          `Third-party merchants. We must share your order information and necessary transaction
          information with third party merchants so that they can provide you with goods,
          services and after-sales services.`,
          `Other business partners. We may also share information with the partners who entrust us
          with promotion and advertising, but we will only provide such partners with the coverage,
          effectiveness and statistics of promotion, rather than provide personal information
          that can identify you.`,
          `(5) Based on the agreement: it is necessary to share with a third party according to the
          relevant agreement (including online electronic agreement and platform rules) or legal
          documents signed by you and us;`,
          `(6) Based on reasonable business habits: for example, sharing the winning information of
          joint marketing activities with a third party, so that the third party can timely issue
          prizes to you; Or when we plan to conduct capital market activities (including but not
            limited to IPO and bond issuance) with other companies for due diligence, etc.;`,
          `(7) Based on academic research; For example, it is necessary to carry out statistics or
          academic research for scientific research institutions;`,
          `(8) Based on the social and public interests in line with laws and regulations.`,
          `Please note that even with your authorization and consent, we will only share your
          personal information for lawful, legitimate, necessary, specific and specific purposes,
          and try to de-identify the personal information in the Shared content. Your contact
          information belong to personal sensitive information.`,
          `We will sign strict information protection and confidentiality agreements with companies,
          organizations and individuals with whom we share personal information only for the
          purpose stated in this policy, and require them to comply with the agreement and take
          relevant security measures to protect your personal information.`,
        ]
      },
      {
        subtitle: `(2) Assignment`,
        content: [
          `With the development of our business, we and our affiliates possible mergers,
          acquisitions, asset transfer or similar deals, such as involved in the transfer
          of personal information, we will require the transferee your personal information
          of the company, the organization continue to accept this privacy policy constraints,
          otherwise, we will ask the company, organization, to ask for your authorization.`
        ]
      },
      {
        subtitle: `(3) Public disclosure`,
        content: [
          `We may only publicly disclose your personal information if:`,
          `1. Disclose the personal information designated by you in a manner of disclosure
          that you expressly agree to according to your needs;`,
          `2. In the case that your personal information must be provided according to
          the requirements of laws and regulations, mandatory administrative law enforcement
          or judicial requirements, we may publicly disclose your personal information
          according to the type of personal information required and the way of disclosure.
          Subject to compliance with laws and regulations, when we receive a request for
          such disclosure, we will require the corresponding legal documents, such as summons
          or letter of investigation.`,
          `(4) Exceptions to obtaining prior authorization for the sharing, transfer or public
          disclosure of personal information`,
          `Under the following circumstances, sharing, transferring and publicly disclosing
          your personal information does not require your prior authorization and consent:`,
          `1. Those related to national security and national defense security;`,
          `2. Those related to public safety, public health and major public interests;`,
          `3  Relating to criminal investigation, prosecution, trial and execution of judgment;`,
          `4. In order to protect your or other individuals' lives, property and other significant
          legal rights and interests, but it is difficult to get my consent;`,
          `5. Other public interest cases, such as your credit evaluation information needs
          to be disclosed and Shared;`,
          `6. Your personal information disclosed to the public;`,
          `7. Collecting personal information from legally disclosed information, such as legal news
          reports, government information disclosure and other channels.`,
          `In accordance with the laws and regulations, if we share, transfer and publicly
          disclose de-identified personal information, and ensure that the data receiver cannot
          recover and re-identify the subject of personal information, we will not need to
          notify you and obtain your consent for the processing of such data.`,
          `Please note that the information you voluntarily post or even publicly share when
          using our service may involve your or others' personal information or even personal
          sensitive information, such as your transaction information, and you choose to upload
          text, picture, video and other forms of information containing your personal information
          when evaluating. Please consider more carefully whether to publish or even publicly
          share relevant information when using our services.`,
        ]
      },
      {
        subtitle: `(I) Preservation of personal information`,
        content: [
          `1. Term of retention: unless in accordance with laws and regulations or agreed by
          both parties, we will only retain your personal information as soon as necessary
          for the purpose. When you take the initiative to cancel your account, we will
          delete your personal information or anonymize it as soon as possible according
          to the requirements of laws and regulations. Please refer to the user cancellation
          agreement attached to this policy for the relevant rules and procedures of account
          cancellation.`,
          `2. Storage area: in principle, the personal information we collect and generate
          in Malaysia will be stored in Malaysia, except the following situations:`,
          `In the above circumstances, we will and require the data receiving party to treat
          the personal information in accordance with this privacy policy and other relevant
          security and confidentiality measures.`,
          `3. Termination of operation: in case of termination of operation, we will notify you
          at least 30 days in advance and delete or anonymize your personal information after
          termination of operation.`,
        ]
      },
      {
        subtitle: `1. Data security measures`,
        content: [
          `In order to protect your information security, we strive to adopt various physical,
          electronic and management security measures in line with industry standards to
          protect your personal information, and establish data classification and classification
          system, data security management standards, and data security development standards
          to manage and regulate the storage and use of personal information.`,
          `Vouchy controls the overall security of data through the information contact
          confidentiality agreement, monitoring and audit mechanism. Protect your personal
          information from unauthorized access, public disclosure, use, modification,
          damage or loss. For example, use SSL encryption when exchanging data (such as
            credit card information) between your browser and the "service"; At the same time,
            HTTPS secure browsing mode is provided for the website itself; Use encryption
            techniques to ensure data confidentiality; Using trusted protection mechanisms
            to protect data from malicious attacks; Deploy access control mechanisms to ensure
            that only authorized personnel have access to personal information; And conduct security
            and privacy protection training courses to enhance employees' awareness of the
            importance of protecting personal information.`,
          `3. Please note and understand that the Internet is not an absolutely safe environment.
            We strongly recommend that you use complex passwords in a secure way to help us
            ensure the security of your account. If you find that your personal information
            is disclosed, especially your account or password, please immediately contact us
            according to the contact information provided in this privacy policy, so that we
            can take corresponding measures.`
        ]
      },
      {
        subtitle: `2. Security incidents`,
        content: [
          `After unfortunately personal information security incidents, we will immediately
          set up specialized emergency response teams, start the emergency plan, to prevent
          security incidents to expand, and in a timely manner according to the requirements
          of laws and regulations to you told: basic situation and the possible influence of
          security incidents, the disposal measures we have taken or will be, you can be
          independent to prevent and reduce the risk of advice, for your remedy, etc. We will
          timely inform you of relevant information of the event by mail, letter, telephone,
          push notification, etc. If it is difficult to inform the subject of personal information
          one by one, we will take a reasonable and effective way to announce. At the same time,
          we will also, in accordance with the requirements of regulatory authorities, take the
          initiative to report the disposition of personal information security incidents.`
        ]
      },
      {
        subtitle: `You have the following rights to your personal information:`,
        content: [
          `(I) you have the right to access, correct and delete your personal information,
          except for exceptional circumstances stipulated by laws and regulations.
          You can manage your information by:`,
          `Search browsing information -- you can access or clear your search history, view
          and modify interests, and manage other data in the Vouchy page \App.`,
          `Ticket information - you can view all your completed, pending, for sale, pending
          review orders by visiting my ticket page. `,
          `If you are unable to manage these personal information through the above link,
          you can contact our customer service at any time. We will respond to your request
          within 30 days.`,
          `(ii) Change the scope of your authorization consent or withdraw your authorization`,
          `Please understand that when you perform the above actions, we will not be able to
          continue to provide you with the services corresponding to the withdrawal of consent
          or authorization, but it will not affect the previous personal information processing
          based on your authorization.`,
        ]
      },
      {
        subtitle: `(3) Cancel the account`,
        content: [
          `You have the right to cancel your Vouchy account. You can conduct online operations
          by calling our customer service number "0186625753" to help log out. Please refer
          to the attached user cancellation agreement for the relevant rules and procedures
          of account cancellation. After you log out successfully, we will delete your personal
          information or make anonymization as soon as possible according to the requirements
          of laws and regulations.`,
          `If you are unable to access, correct or delete your personal information and log out
          your account through the above ways, or if you think that Vouchy has the situation of
          collecting and using your personal information in violation of legal provisions, you
          can get in touch with us through our customer service or through other means provided
          by this privacy policy. In order to ensure security, we may need you to provide
          relevant means to prove your identity and the legitimacy of your request. We will
          reply to your request within 30 days after receiving your feedback and verifying your
          identity. For your reasonable request, we do not charge in principle, but for repeated
          requests, exceeding the reasonable limit, we will charge a certain cost as the case
          may be. We may refuse requests that are gratuitously repetitive, that require too
          much technology (for example, developing new systems or radically changing existing
            practices), that pose a risk to the legitimate rights of others, or that are very
            impractical (for example, involving backing up information stored on tape).`
        ]
      },
      {
        subtitle: `Vi. Protection of minors' personal information`,
        content: [
          `Vouchy attaches great importance to the protection of minors' personal information.
          Our website and services are geared towards adults. If you are a minor, you are
          advised to ask your parents or guardians to carefully read this privacy policy
          and use our services or provide information to us with the consent of your parents
          or guardians.`,
          `We will only use, share, transfer or disclose the personal information of minors
          collected through the use of our products or services with the consent of parents
          or guardians, if permitted by laws and regulations, with the explicit consent of
          parents or guardians or necessary to protect minors.`,
          `If we find that we have collected the personal information of a minor without
          the prior consent of a verifiable parent or legal guardian, we will try to delete
          the relevant data as soon as possible.`
        ]
      },
      {
        subtitle: `Notices and amendments`,
        content: [
          `To provide you with better services, our business will change from time to time,
          this privacy policy will be adjusted accordingly. We do not reduce your rights
          under this privacy policy without your express consent. We will issue updated
          versions on our website, mobile terminal or by other means to remind you of the
          update of relevant content. Please also visit us for the latest privacy policy.
          In the foregoing circumstances, if you continue to use our services, you agree to
          accept and be bound by the revised policy.`
        ]
      },
      {
        subtitle: `How to contact us`,
        content: [
          `If you need to report any complaints about our personal information processing,
          you can contact us through Vouchy website or bug report system provided on the App
          and make a full description, we will reply to your request within 30 days of
          verifying your identity and try our best to solve.`,
          `If you are not satisfied with our reply, especially if you think that our personal
          information processing has damaged your legitimate rights and interests, you can
          also file a lawsuit to the court with jurisdiction in the defendant's domicile.`
        ]
      },
      {
        subtitle: `Appendix:`,
        content: [
          `1. Personal information: refers to all kinds of information recorded by electronic
          or other means that can identify the identity of a specific natural person or
          reflect the activities of a specific natural person independently or in combination
          with other information. Personal information that may be involved in this privacy
          policy includes but is not limited to: personal basic information (including name,
            telephone number, gender, address, birthday, etc.); Personal identity information
            (including id card, military certificate, passport, driving license, etc.);
            Network identity identification information (including system account number,
              IP address, email address and password, password and password protection answer
              related to the foregoing); Personal property information (including bank account
                number, transaction and consumption records, credit records and virtual
                property information, etc.); Personal health and physiological information
                (including symptoms, medical records, medical history, etc.); Contact
                information (including address book, friend list, etc.); Personal Internet
                surfing record (including website browsing record, click record, etc.);
                Personal device information (including hardware model, operating system type,
                  unique device identification code and other information describing basic information
                  of personal common equipment); Personal location information (including track,
                    precise location information, accommodation information, latitude and longitude,
                    etc.)`,
          `2. Personal sensitive information: once disclosed, illegally provided or abused,
          it may endanger personal and property safety and easily lead to personal reputation,
          physical and mental health damage or discriminatory treatment. Sensitive personal
          information that may be involved in this privacy policy includes: personal identity
          information (including id card, military certificate, passport, driving license, etc.);
          Personal property information (bank account number, transaction and consumption records,
            credit records and virtual property information, etc.); Network identity information
            (including account name, account nickname, email address, password and password protection
              questions and answers related to the foregoing); Other information (personal phone
                number, marital history, religion, whereabouts, etc.).`,
          `3. Associated account: you can use the same mobile phone number to log in the product \
          service provided by Vouchy, so that we can provide you with consistent services and
          unified management based on the associated account.`
        ]
      },
      {
        subtitle: `User cancellation agreement`,
        content: [
          `Before you close your account, please read, understand and agree to the following:`,
          `We hereby kindly remind you that your cancellation of Vouchy account will result in our
          termination of the service for you, and will also bring a lot of inconvenience to your
          after-sales rights protection. After successful logout, we will delete your personal
          information to keep it unretrievable, accessible, or anonymized. You know and understand
          that, according to relevant laws and regulations, relevant transaction records shall be
          kept in Vouchy for one year or longer.`,
          `1. If you still want to cancel your account, your account shall meet the following conditions:`,
          `(1) The account has no assets or arrears in the Vouchy rating system;`,
          `(2) There are no outstanding orders or orders/services provided but not paid in the account;`,
          `(3) The account is free from any disputes, including complaints or reports;`,
          `(4) The account is the account in normal use and there is no record that any account is
          restricted;`,
          `(5) The Vouchy payment account corresponding to the account has been cancelled, and all
          problems under the Vouchy payment account have been properly dealt with;`,
          `2. During the cancellation of Vouchy account, if your Vouchy account is involved in disputes,
          including but not limited to complaints, reports, lawsuits, arbitration, investigations by
          competent authorities, Vouchy has the right to terminate the cancellation of this Vouchy
          account without your consent.`,
          `3. Please be sure to unbind other relevant accounts before submitting the cancellation
          application. Please contact our customer service for details.`,
          `4. Vouchy that once the account is cancelled, it will not be restored. Please backup
          all the information and data related to the account by yourself before operation. If
          you cancel your Vouchy account, you will no longer be able to use this Vouchy account,
          nor will you be able to retrieve any content or information related to your Vouchy
          account (even if you use the same mobile phone number to register and use Vouchy again),
          including but not limited to:`,
          `(1) You will not be able to log in and use the Vouchy account;`,
          `(2) The Vouchy account's personal information and historical information (including but
            not limited to user name, nickname, avatar, reservation/group purchase record, etc.)
            will not be recovered;`,
          `(3) All records of Vouchy websites/APP logged on by you through Vouchy account will
          not be recovered. You will no longer be able to log in and use the aforementioned
          services, and the coupons, credits, and other card coupons you have obtained will
          be deemed as your own abandonment and will not be able to continue to use. You understand
          and agree that Vouchy cannot assist you in restoring the aforementioned services.`,
          `5. The cancellation of the Vouchy account does not mean that the account behavior and
          relevant responsibilities before the cancellation of the Vouchy account are exempted or
          reduced.`,
        ]
      },
      {
        subtitle: `Thanks again for your patience!`,
        content: [
          ``
        ],
      },
    ];
  }
}
