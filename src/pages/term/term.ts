import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-term',
  templateUrl: 'term.html',
})
export class TermPage {

  termsList: any;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    this.setUpTermsList();
  }

  back() {
    this.navCtrl.pop();
  }

  private setUpTermsList() {
    this.termsList = [
      {
        subtitle: `Welcome to register Vouchy account and use Vouchy service!`,
        content: [
          `This "Vouchy platform user service agreement" (hereinafter referred to as
            "the service agreement") is the agreement between you and Vouchy on matters
            related to the registration of Vouchy user account and the use of Vouchy
            services. For the use of Vouchy services, you should carefully read and
            comply with all of the content of this service agreement, especially those
            provisions involving exemption or limitation of liability, which may be
            highlighted in bold or underlined form. Unless you have read and accepted
            all terms of this service agreement, you will not be able to register
            Vouchy account or use Vouchy service. If you do not agree with any content
            of these terms of service, please do not register or use Vouchy service,
            and should immediately stop the registration process. If you have any doubt
            about the content of this service agreement (especially the clauses involving
              exemption or limitation of liability), you can contact us at any time
              according to the contact information listed in this service agreement,
              and we will further explain the relevant content for you according to your
              requirements. If you use or accept any service of Vouchy through the
              registration process or in any other way, you shall be deemed to have read
              and agreed to this service agreement and voluntarily accept all contents of
              this service agreement. Please confirm once again that you are aware of and
              fully understand all contents of this service agreement before you decide to
              register or use the service.`,
          `If you are under the age of 18, please be sure to read this service agreement
          accompanied by your parents and other legal guardians, and you should get the
          consent of your parents and other legal guardians before any behavior such as
          registration, order placing, payment or any other service using Vouchy.`,
          `The "services" referred to in this service agreement include the services
              provided by the Vouchy user account to the merchants and individuals related
              to the Vouchy platform, and the services provided by the Vouchy user account
              to other merchants, individuals or other entities under certain business
              categories. This user service agreement for Vouchy platform shall apply
              regardless of the above circumstances.`
        ],
      },
      {
        subtitle: `I. Subject and scope of the agreement`,
        content: [
          `[Contract subject] depends on the specific services you use. "Vouchy" refers
          to the general designation of the relevant subjects operating or providing
          the specific services you use under Vouchy. You can check the names and information
          of the above subjects in the specific terms of service or description documents
          of the relevant services. "User" means a user of a Vouchy related service, more
          commonly referred to as "you" in this service agreement.`
        ],
      },
      {
        subtitle: `[Agreement contents] this service agreement also includes:`,
        content: [
          `(1) The platform Vouchy privacy policy, Vouchy attaches great importance to the protection
          of your personal information and privacy, and will be in accordance with the
          "Vouchy platform privacy policy" in the published policy in the specific
          service on privacy and personal information collection, storage, use, disclosure
          and other activities. Before you register your Vouchy account, you should
          carefully read the "Vouchy platform privacy policy".`,
          `(2) Terms of service of specific services: once you register your Vouchy platform
          account, you can enjoy various rich services on Vouchy platform by virtue of this
          account. In order to better provide you with various services, Vouchy platform has
          formulated special terms of service for specific services for all parties to abide
          by. You may refer to and download such terms of service in the website, page or
          application of the specific service. You should carefully read the terms of service
          applicable to the service before using the specific service. By registering a Vouchy
          account and using the Vouchy account to use the specific service, you mean that you
          have accepted the terms of service at the same time and will be subject to the terms
          of service.`,
          `(3) Rules for special goods or services. In order to better improve the user
          experience, Vouchy has formulated detailed rules in a number of specific goods or
          services for all parties to abide by.`,
          `(4) User authorization agreements related to third-party services. For the convenience
          of you in the use of Vouchy platform service at the same time, according to your own
          needs, jump through Vouchy platform, voluntarily choose to accept independent
          third party service providers and some related services provided by the third
          party service provider, you will be in front of the use of such third party service
          to the corresponding user authorization agreement agreed to confirm, as between you
          and the Vouchy platform is the use of such third party service related matters
          involved in the rights and obligations of the basis.`,
          `In case of any inconsistency between the foregoing contents, the latest published
          contents shall prevail. In case of the same published time, the components contained
          in this clause [agreement contents] shall be in reverse order`
        ],
      },
      {
        subtitle: `You understand and agree that:`,
        content: [
          `(1) The agreements, policies, terms and rules described in the above [agreement contents]
          shall form an integral part of the service agreement and be jointly applicable
          to the Vouchy platform service you use.`,
          `(2) According to the national laws and regulations change, operation needs or for
          the purpose of improving the quality of service, Vouchy will review when necessary,
          to the above-mentioned agreement terms and rules are modified from time to time to
          update, and through the web or mobile client issued announcement, reasonable stand
          inside letter, etc. On the smart way to advance notice to you, the above changes
          updated content will be the date specified in the relevant update notes, normally not
          less than eight natural day after the date of release.`,
          `(3) You should timely check and understand the relevant update and modification contents.
          If you do not agree with the relevant update and modification contents, you can stop
          using the services involved in the relevant update and modification contents. In this case,
          the changes shall have no effect on you; If you continue to use the services involved after
          the implementation of the above updates and modifications, you will be deemed to have agreed
          to the updates and modifications.`,
          `[Applicable platform] this service agreement is applicable to the services provided by
          various platforms or media, including the web side and mobile client side (including IOS,
            android and any other mobile client side that has been or will be added in the future).
            You acknowledge and understand that, in order to enjoy the above services, you must provide
            relevant online devices (such as personal computer, mobile phone, tablet computer or other
              devices) and bear the relevant costs arising from the use of the network and the payment
              of goods and services.`
        ],
      },
      {
        subtitle: `Ii. Account registration`,
        content: [
          `"Registration data" you should follow the principle of honesty and credit, legal, submit
          to the Vouchy relevant registration information, registered information shall abide by
          the laws and regulations, the socialist system, national interests and citizens'
          legitimate rights and interests, and disgraceful consideration information such as
          real principle, should not commit any illegal or bad information, of any change of
          relevant information you should be updated in a timely manner. If the registration
          information provided by you is illegal, untrue, inaccurate or not updated in time,
          resulting in relevant legal liabilities or adverse consequences, you will bear the
          corresponding legal liabilities and adverse consequences.`,
          `You have learned that during the registration process of Vouchy account, some initial
          registration data may not be able to be changed again due to security, internal management
          and other reasons. Therefore, you should carefully check this part of the registration
          information, to ensure that the correct completion.`,
          `[Civil capacity] you acknowledge and undertake that you have full capacity for civil
          rights or that you have obtained the consent of your parents and other legal guardians
          but you do not have full capacity for civil rights but your parents and other legal
          guardians have registered and used Vouchy services on your behalf. If you do not have
          the aforementioned civil capacity to conduct account registration, you and your parents
          and other legal guardians shall bear all the consequences arising therefrom in accordance
          with the law.`,
          `"Identity" by national laws and regulations, regulatory requirements and specific categories
          of services (such as financial services, etc.), you may need to register or use the services
          of a particular link fill in true identity information, and can be used only by related
          validation process service, such as the identity information you fill in is not complete,
          not real or not through the verification, will cause you can't use the service, damage
          the interests of themselves, others or other adverse consequences, the consequences will
          be bear by you.`,
          `Vouchy will protect your submitted registration information and will not disclose it to
          any non-associated third party unless:`,
          `(1) Relevant laws and regulations or requirements of state organs;`,
          `(2) Vouchy the occurrence of relevant mergers, split-ups, acquisitions or asset transfers; or`,
          `(3) Necessary for the provision of relevant services`,
          `For the content of personal information in the registration information submitted by you,
          Vouchy will collect, process and use it in strict accordance with the privacy policy of
          Vouchy platform.`,
          `[Number of accounts] except for special cases recognized by Vouchy such as historical
          reasons and business integration, Vouchy only allows you to use one Vouchy user
          account in principle. Any evidence or Vouchy have reason to believe that you have
          not registered or inappropriate use of multiple Vouchy account of the circumstances,
          Vouchy relevant account information can be merged or take other reasonable measures,
          such as improper you register or improper use losses to Vouchy and related party, you
          also shall bear the corresponding liability to pay compensation. In addition, Vouchy
          may also combine multiple accounts or relevant information of the same user for the
          needs of relevant businesses. If such combination will have a material impact on your
          rights and interests, Vouchy will obtain your consent in advance before such combination.`
        ],
      },
      {
        subtitle: `Iii. Account usage`,
        content: [
          `[Account login] you can log in the Vouchy platform with the account password that you
          filled in and approved by the system when registering your account. Vouchy according
          to relevant laws and regulations, regulatory requirements, login user experience,
          risk control and other factors on the way to timely adjust or increase or decrease,
          or in a specific business category of users to be further refined in terms of service
          and other rules or adjustment.`,
          `[Account usage] you shall be responsible for all consequences arising out of all
          actions under your account (including but not limited to signing any agreement online,
            browsing, purchasing, paying, commenting, uploading, publishing and inputting any content).
            All actions occurring through your account shall be deemed as your true intention.`,
          `Vouchy prompt you that any content you upload or send through your own account in the
            various services receiving Vouchy should have a legitimate source. If the relevant
            content involves the legitimate rights and interests of any third party, you should
            obtain the corresponding permission in advance. If Vouchy receives relevant reports
            or complaints involving you, Vouchy may provide necessary information, including
            account number, to relevant disputing parties and relevant departments as required
            or permitted by relevant laws and regulations, so as to solve disputes and protect
            legitimate rights and interests of legitimate right holders.`,
          ` [Account borrowing] to ensure the security of relevant accounts, you shall not
            lend the accounts registered on Vouchy platform to others without the written consent
            of Vouchy platform, otherwise you shall bear all the responsibilities arising
            therefrom. Vouchy platform reserves the right to refuse to provide corresponding
            services, freeze or withdraw the registered accounts or terminate this service
            agreement, and may require you to compensate for the losses suffered by Vouchy.`,
          `[Security obligations] if you find any security problem in your account,
            please immediately contact Vouchy for investigation and treatment, otherwise
            Vouchy will not assume any responsibility for the generation or expansion of
            potential losses.`,
          `Vouchy specially remind you that you should properly keep your account and password,
            and you should exit safely after you use the Vouchy service. In addition, you should
            not be credulous borrowing, asking for passwords or other network information involving
            property. Involving property operations, please be sure to verify the identity of
            each other, and please often pay attention to Vouchy on the prevention of fraud tips.
            You acknowledge and agree that, if you on the storage of account information in the
            network security maintenance, related equipment online account loss, as a result of
            any negligence, leaks, you should be responsible for the results of any, Vouchy not
            responsible to this, such as Vouchy resulting related expenditure, Vouchy will have
            the right to recourse to you.`,
          `[Limited freezing] you acknowledge and agree that Vouchy has the right to restrict
            or freeze your registered account in accordance with the provisions of laws and regulations,
            or as required by the state authorities. In such circumstances, you may not be able
            to continue to log in or use your registered account.`,
        ],
      },
      {
        subtitle: `Iv. User behavior norms and responsibilities`,
        content: [
          `[User obligations] you acknowledge and undertake that you shall abide by relevant laws
          and regulations in the process of using the services provided by Vouchy, and shall not
          engage in any of the following behaviors that violate laws and regulations, affect the
          normal service delivery or harm the legitimate interests of others:`,
          `(1) Should not be using Vouchy platform or related services endanger national security
          and disrupt the political stability, divulging state secrets, no violation of the state,
          society, collective interests and the legitimate rights and interests of a third party,
          not to engage in illegal and criminal activities, do not set up to implement fraud,
          imparting criminal methods, making or selling banned items, control items of illegal and
          criminal activities such as website, communications group, don't use a network issue
          involves the implementation of fraud, making or selling banned items, control items and
          other illegal and criminal activities of information;`,
          `(2) Shall not produce, publish, reproduce, consult, disseminate, store or link the following
          information: Endangering state security, divulging state secrets, subverting state power,
          overthrowing the socialist system, inciting secession or undermining national unity;
          Harming the honor and interests of the state; Inciting ethnic hatred or discrimination
          and undermining national unity; Sabotaging the state's religious policies and promoting
          cults and feudal superstitions; Inciting unlawful assembly, association, procession,
          demonstration or gathering of people to disrupt public order; Fabricating or spreading
          rumors, infringing upon the rights of others, disrupting economic and social order, or
          undermining social stability; Distributing obscenity, pornography, gambling, violence,
          murder, terror or abetting a crime; Insulting or slandering another person, or infringing
          upon the lawful rights and interests of another person; Promoting terrorism or extremism;
          Violating local customs and habits; Containing other contents prohibited by laws and
          administrative regulations`,
          `(3) Shall not engage in the following activities endangering the security of computer
          information networks: cracking, destroying, deleting, modifying or adding network services
          and related software and hardware facilities; Deleting, modifying or adding to the data
          and applications stored or transmitted in the computer information network; Using software
          or hardware to steal others' passwords or illegally invade others' computer systems;
          Intentionally creating or disseminating destructive programs such as computer viruses;
          Other activities that endanger the security of computer information networks;`,
          `(4) Unauthorized copying and use of unpublished and unauthorized files on the network
          shall not be allowed. Except with the express consent of the relevant copyright owners,
          the software enjoyed copyright by the third party shall not be cracked, disseminated,
          downloaded or copied in the network or any other activities that infringe the intellectual
          property rights of others;`,
          `(5) Users shall not privately spread advertising information or help others improve evaluation
          by "brushing" or use the right of evaluation to threaten or blackmail other users and merchants;`,
          `(6) The use of Vouchy related services should not lead to the involvement of Vouchy in
          political and public events;`,
          `(7) Party b shall not trade or participate in Vouchy any activities published by the third
          party authorized by it by means of violating the legitimate rights and interests of the
          third party, cheating, disrupting the system, carrying out network attacks, malicious cashing
          out, swiping reputation, batch registration, registering Vouchy platform account with the
          machine, simulating the client with the machine, etc.;`,
          `(8) Without the prior written permission of Vouchy, party b shall not, on its own, authorize
          or assist any third party to illegally capture any content displayed in Vouchy (" illegal
          capture "refers to the act of obtaining content data through programs or abnormal browsing
          or other technical means not approved by Vouchy).`,
          `[Liability] if you are involved in one or more of the above behaviors when using Vouchy
          service, you need to take legal responsibility for your own behaviors. The forms of bearing
          legal liability include but are not limited to: making compensation for the aggrieved person
          and paying the administrative penalty or tort damages liability (including legal costs,
            attorney's fees and other relevant legal procedure costs) caused by your behavior first
            after Vouchy, you should immediately give Vouchy equal compensation. In addition, Vouchy
            has the right to make an independent judgment based on specific violations of laws and
            regulations, and immediately suspend or terminate all or part of the services provided
            to you, including locking, cancellation, account deletion and other measures. At the same
            time, you agree, as a result of your behavior causes economic losses to others, Vouchys can
            be for public interests protection, consumer protection, principles for the protection of
            business interests, in the premise of legal compliance, from your purse treasure (if any)
            draw the corresponding account, you agree and authorize, entrust Vouchys for the draw operation.`,
          `You know and understand, if Vouchy found you the above violation behavior, based on the
            provisions of relevant laws and regulations, Vouchy shall have the right to or obligated
            to immediately stop related services, delete or block related illegal information,
            service evaluation, and carries on the investigation circumstances, keep relevant records,
            or report to the relevant state authority. At the same time, Vouchy have the right
            to delete or block any data information containing the content. Vouchy will record
            and save data information deleted or blocked according to relevant national laws
            and regulations.`,
          `[Advertising] you understand and agree that: in order to provide you with more detailed
            and thoughtful service, after your confirmation in advance, Vouchy reviewed or authorized,
            approved third-party merchants, advertisers may register through you to fill in the
            mobile phone number or email to you send you might be interested in goods and services
            of advertising, promotions and other commercial information, the way and scope of
            change without special notice to you; If you are not willing to receive such information,
            you have the right to unsubscribe through the corresponding unsubscribe method
            provided by Vouchy platform.`,
          `You understand and agree that for the above advertising information, you should carefully
            judge its authenticity and reliability, except for the provisions of laws and regulations,
            you should be responsible for the advertising information transactions.`,
          `[Purpose of use] unless otherwise agreed by you and Vouchy in specific terms of service
            or rules or otherwise agreed in writing by Vouchy, you will ensure that the services
            under this service agreement are only for your personal and non-commercial use. Without
            the written consent of Vouchy, you shall not use any plug-ins, third-party tools that are
            not authorized by Vouchy to interfere, damage, modify or otherwise influence the services
            under this service agreement.`,
        ],
      },
      {
        subtitle: `V. Intellectual property rights`,
        content: [
          `[Intellectual property rights] you understand and acknowledge that, except as otherwise stated
          in writing, the intellectual property rights (including but not limited to patent rights,
            copyright, trademark rights and trade secrets) of the following information and contents
            belong to Vouchy:`,
          `1. Content and information provided in Vouchy related services (including but not limited
            to software, technology, programs, web pages, text, pictures, images, maps, ICONS, audio,
            video, charts, layout, electronic documents, data, etc.);`,
          `Vouchys the infrastructure and platform (including but not limited to software, websites,
              applications, etc.) used to provide the above content and information;`,
          `3. Vouchy trademarks, business images, business signs, technical know-how, slogans,
              copywriting, etc. used in providing relevant services;`,
          `4. All data and information generated during the development, operation and maintenance
          of Vouchy platform services.`,
          `Vouchy the above rights and owned by providing services of any content contained in the
          intellectual property rights are protected by law, without the prior written permission
          of Vouchy  your promise should not and should not allow or assist anyone in any way
          (including, but not limited to, through any robot, spider, screenshots) program or device
          to use, lease, lend, distribute, display, copy, modify, links, reprints, compiled and
          published, publishing, scraping, surveillance, reference, or create derivative works.`,
          `[User-generated content] you understand and agree that the content you upload,
          submit, store or publish (including but not limited to text, pictures, video, audio,
            animation, etc.) when you use the service provided by Vouchy is created by you or
            legally authorized. The intellectual property rights of any content uploaded, submitted,
            stored or published by you through Vouchy belong to you or the original copyright
            owner. Your act of uploading, submitting, storing or publishing will not infringe
            the intellectual property rights or other legitimate rights and interests of others`,
          `You acknowledge, understand and agree that by accepting this service agreement,
            you take the initiative to transfer the non-exclusive and transferable property
            rights of the above contents, such as copyright (including but not limited to:
              Copy rights, distribution rights, right of rental, exhibition, which, presentation,
              broadcasting, information network transmission right, translation rights, rights of
              assembly and the other negotiable rights of the copyright owner shall), permanent,
              free, exclusive worldwide and irrevocably authorized to Vouchy and its affiliates,
              Vouchy and its affiliates can be based on such authorized the use of the above
              content (including but not limited to be used for commercial purposes) or to a
              third party independent of any necessary authorization. Turn such authorization,
              authorized the use of scenarios including but not limited to the current or any
              other websites, applications, products, or mobile terminal equipment, etc.,
              and Vouchy and its associated companies or Vouchy and its affiliates licensing
              by the third party by modifying the content of the above authorization,
              reproduction, adaptation, translation, assembly or production, formation of
              derivatives. On the basis of not violating the mandatory provisions of relevant
              laws and regulations and respecting the intellectual property rights of the
              original licensed content, the intellectual property rights related to such
              derivative products belong to Vouchy and its affiliates or the third parties
              authorized by Vouchy.`,
          `You confirm and agree to authorize Vouchy and its affiliated companies to
              conduct independent and independent rights protection and obtain all
              compensation in the name of Vouchy and its affiliated companies or in the
              name of a professional third party entrusted by you for the infringement of
              the content (including derivative works) uploaded, submitted, stored or
              published by you. Forms of rights protection include but are not limited to:
              monitoring infringement, sending letters of rights protection, filing lawsuits
              or arbitration, mediation, reconciliation, etc. Vouchy and its affiliated
              companies have the right to make independent decisions and implement rights
              protection issues.`,
          `You agree that you will take full responsibility for any intellectual property
              infringement caused by any content you upload or post through Vouchy. If Vouchy
              and its affiliates, or other service providers authorized by Vouchy suffer
              losses due to third party intellectual property rights protection, you will be
              compensated equally.`,
          `This service agreement has already constituted the written agreement provided
              for in article 25 of the copyright law, and its effect is related to the content
              of any work protected by the copyright law published by users on the Vouchy
              platform, whether the content is formed before or after the signing of this
              service agreement. Vouchy and turn Vouchy licensing, licensing of related party
              is entitled to your published in Vouchy on the platform of product using
              experience, product discussion or pictures for use or cooperate with others
              to use, use scope including but not limited to site, electronic journals,
              magazines, journals, posters, public articles, WeChat small programs, etc.`,
          `You may need to download specific software when reviewing related clients
              using Vouchy. In order to improve user experience, fix bugs, ensure security
              and other considerations, Vouchy has the right to update the software, you
              should update the relevant software to the latest version, otherwise Vouchy
              will not guarantee that you can use the relevant software.`,
          `If you obtain the software from a third party without the authorization
              of Vouchy or an installation program with the same name as the software,
              Vouchy cannot guarantee the normal use of the software, and Vouchy will
              not be responsible for any losses caused thereby.`,
          `[Prohibitions on software use] unless Vouchys written permission, you may
              not engage in any of the following activities when using Vouchys:`,
          `(1) Delete, edit or block information about copyright, trademark or other right
              marks or marks on the software and its copies;`,
          `(2) Copying, distributing, selling or renting the software or any part thereof;`,
          `(3) Reverse engineer, reverse assemble and reverse compile the software, or
              try to mine and extract the source code of the software in other ways;`,
          `(4) Any other actions of adding, deleting or changing the software and the
              data generated by the software, including making, using and authorizing all
              kinds of third-party plug-ins, and systems to do the above actions.`,
        ],
      },
      {
        subtitle: `Vi. Termination of the agreement`,
        content: [
          `[Termination of agreement] this service agreement shall be terminated under any of the
          following circumstances:`,
          `(1) Vouchy has the right to withdraw or cancel the user account according to the
          provisions of this service agreement. In this case, this service agreement shall
          terminate on the date of account withdrawal or cancellation;`,
          `(2) When the account cancellation conditions published by Vouchy platform are met,
          you can cancel the user account of Vouchy through the website self-service or the
          customer service of Vouchy, and this service agreement will be terminated on the
          date of account cancellation. You understand and agree that you have carefully
          read and accepted the Vouchy privacy policy and its appendix I user cancellation
          agreement, and have understood and agreed to the relevant user cancellation process
          and rights and obligations arrangement after the cancellation;`,
          `(3) Vouchy shall have the right to terminate all Vouchy platform services with
          reasonable prior notice according to its own business arrangements, and this
          service agreement shall terminate on the date when all Vouchy platform services
          are terminated in accordance with the procedures and methods prescribed by law.`,
          `After the termination of this service agreement, Vouchy will not be able to
          continue to provide you with any services or perform any other obligations,
          including but not limited to, retaining or disclosing any information in its
          original Vouchy account for you, and forwarding any unread or sent information
          to you or any third party.`,
          `The termination of this service agreement shall not affect the validity of
          article 5 intellectual property clauses and other clauses which shall continue
          to be valid according to their contents, nor shall it affect the relevant rights
          and obligations of the parties before the termination of this service agreement,
          including but not limited to, the non-breaching party shall hold the breaching
          party liable for breach of contract according to this service agreement.`
        ],
      },
      {
        subtitle: `Notice and delivery`,
        content: [
          `You acknowledge that Vouchy may notify you of important information in one or
          more of the following ways as appropriate:`,
          `(1) Send electronic information to the E-mail address you submitted at the
           time of registration;`,
          `(2) Send electronic information to the mobile phone number submitted at
           the time of registration;`,
          `(3) Send paper carrier information to the actual address you provide;`,
          `(4) Display electronic information on the website or in a prominent position
           on the client side;`,
          `(5) Send electronic information to the Vouchy website or the account of
           the corresponding client in the site or other instant messaging client.`,
          `The aforesaid electronic information shall be deemed to have been delivered
           upon successful transmission or completion of publication. The delivery of
           the relevant paper carrier shall be deemed to have been delivered on the
           fifth natural day following the mailing date on the relevant mailing certificate.`,
          `The above service method can also be applied to relevant arbitration or
           judicial procedures (including the stages of prosecution, trial, execution, etc.).`,
          `You should ensure that the contact information provided is accurate and
           effective, and timely update. If the relevant notice, document or document
            cannot be delivered or timely delivered due to inaccurate contact information
            or delay in updating and other reasons not attributable to Vouchy, you will
            bear the legal consequences arising therefrom.`,
        ],
      },
      {
        subtitle: `Viii. Force majeure or other exemptions`,
        content: [
          `[Force majeure] you understand and agree that during the use of the service,
          you may encounter risk factors such as force majeure, which may cause interruption
          or termination of the service hereunder. Force majeure means any unforeseeable,
          can't overcome and unavoidable and to one side or both sides have a significant
          impact of objective events, including but not limited to information network
          equipment maintenance, network connection failure, computer, communications or
          other system failures, power failures, strikes, labor disputes, riots,
          insurrection, riots, productivity or insufficient productive resources, fire,
          flood, storm, explosion, war, government behavior and the change of laws and
          regulations, judicial administrative organs of the command, force majeure or
          other third party can't service or delay caused by inaction. In the case of
          the above, Vouchy will try to cooperate with relevant departments in the first
          time and make timely repair. However, Vouchy will be exempted from liability
          within the scope permitted by law for the losses caused to you.`,
          `[Other disclaimers] you understand and agree that, to the extent permitted by
          law, Vouchy shall not be liable for service interruption or termination caused by:`,
          `(1) Be damaged by computer viruses, Trojan horses or other malicious programs
          and hacker attacks;`,
          `(2) Failure of the computer software, system, hardware and communication
          lines reviewed by the user or Vouchy;`,
          `(3) Improper operation by the user;`,
          `(4) Users use the service in a way that is not authorized by Vouchy;`,
          `(5) Other circumstances beyond Vouchy's control or reasonably foreseeable.`,
          `[Information authenticity] Vouchy indicate that, in the process of using the
          service, you may encounter risks brought by network information or other user
          behaviors, which include threats, defamation, repugnant, illegal, misleading,
          cheating and any other information or behaviors of anonymous or pseudonymous others,
          which may cause any psychological, physical harm or economic loss. Please carefully
          screen, and in the event of the above related illegal ACTS in a timely manner to
          Vouchy or the relevant authorities to report or complain. Vouchy will carry out daily
          inspection on relevant content and deal with relevant reports or complaints when they
          are received. However, please note that Vouchy is not responsible for the authenticity,
          applicability and legality of any information sent or published by non- Vouchy, nor for
          any damage caused to you by third-party infringement.`,
          `[limitation of liability] unless otherwise expressly stated in writing,
          Vouchy does not make any express or implied representations or warranties of
          any kind regarding the information, content, materials, products or services on
          Vouchy's website and clients, subject to the provisions of laws and regulations.`,
          `Jurisdiction, application of law and dispute resolution`,
          `The establishment, effectiveness, performance, interpretation and dispute resolution
          of this service agreement shall be governed by the laws and regulations of Malaysia,
          excluding all conflicts of laws.`,
          `If there is a dispute between you and Vouchy due to the product or service
          problems in a specific service, you agree that such dispute will be accepted
          by the competent people's court in the place where the dispute is settled as
          stipulated in the terms of service or rules applicable to the specific service.
          For the purpose of this service agreement, if any dispute arises between you and
          Vouchy, you agree to submit the dispute to the people's court with jurisdiction
          in the place where this service agreement is signed.`,
        ],
      },
      {
        subtitle: `10 and other`,
        content: [
          `[key words] the key words listed before the terms of this service agreement are
          only for the purpose of helping you understand the subject matter of the terms
          and the terms of rapid positioning query, which cannot replace any content of
          the terms, nor as a basis for the interpretation of the terms. Vouchy suggest
          that you carefully read the specific expressions of the terms, in order to protect
          your legitimate rights and interests.`,
          `[Severability] if any provision of this service agreement is deemed to be invalidated,
          invalid or unenforceable for any reason, such provision shall be deemed severable
          and shall not affect the validity and enforceability of any remaining provisions.`,
          `If you have any questions or Suggestions about this service agreement,
          please contact Vouchy during working hours to comment on the customer service
          department (contact information: Vouchy network: 0186625753).`
        ],
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
