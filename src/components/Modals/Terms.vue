<template>
  <teleport to="body">
    <Modal>
      <ModalContent
        v-click-away="
          () => {
            $emit('close');
          }
        "
        :button-text="$t('ok')"
        :submit-button="false"
        style="width: 1000px"
        @close="$emit('close')"
      >
        <div class="terms">
          <h1>Terms and Conditions</h1>
          <p>
            <b style="color: #59779a">Last updated: </b>
            <b style="color: #6a4bff">June 16, 2020</b>
          </p>
          <p>
            Please read these terms and conditions carefully before using Our
            Service.
          </p>
          <h2 style="margin-top: 10px">Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions.
          </p>
          <p>
            The following definitions shall have the same meaning regardless of
            whether they appear in singular or in plural.
          </p>
          <h3>Definitions</h3>
          <p>For the purposes of these Terms and Conditions:</p>
          <ul>
            <li>
              <p>
                <span class="bold">Affiliate</span> means an entity that
                controls, is controlled by or is under common control with a
                party, where "control" means ownership of 50% or more of the
                shares, equity interest or other securities entitled to vote for
                election of directors or other managing authority.
              </p>
            </li>
            <li>
              <p>
                <span class="bold">Company</span> (referred to as either "the
                Company", "We", "Us" or "Our" in this Agreement) refers to
                Citadel.One PTE. LTD., 160 ROBINSON ROAD #24-09 SINGAPORE
                (068914).
              </p>
            </li>
            <li>
              <p><span class="bold">Country</span> refers to: Singapore</p>
            </li>
            <li>
              <p>
                <span class="bold">Device</span> means any device that can
                access the Service such as a computer, a cellphone or a digital
                tablet.
              </p>
            </li>
            <li>
              <p><span class="bold">Service</span> refers to the Website.</p>
            </li>
            <li>
              <p>
                <span class="bold">Terms and Conditions</span> (also referred as
                "Terms") mean these Terms and Conditions that form the entire
                agreement between You and the Company regarding the use of the
                Service.
              </p>
            </li>
            <li>
              <p>
                <span class="bold">Third-party Social Media Service</span> means
                any services or content (including data, information, products
                or services) provided by a third-party that may be displayed,
                included or made available by the Service.
              </p>
            </li>
            <li>
              <p>
                <span class="bold">Website</span> refers to Citadel.One,
                accessible from
                <a style="color: #00a3ff" href="https://citadel.one"
                  >https://citadel.one</a
                >
              </p>
            </li>
            <li>
              <p>
                <span class="bold">You</span> means the individual accessing or
                using the Service, or the company, or other legal entity on
                behalf of which such individual is accessing or using the
                Service, as applicable.
              </p>
            </li>
          </ul>
          <h2 style="margin-bottom: 8px">Acknowledgement</h2>
          <p>
            These are the Terms and Conditions governing the use of this Service
            and the agreement that operates between You and the Company. These
            Terms and Conditions set out the rights and obligations of all users
            regarding the use of the Service.
          </p>
          <p>
            Your access to and use of the Service is conditioned on Your
            acceptance of and compliance with these Terms and Conditions. These
            Terms and Conditions apply to all visitors, users and others who
            access or use the Service.
          </p>
          <p>
            By accessing or using the Service You agree to be bound by these
            Terms and Conditions. If You disagree with any part of these Terms
            and Conditions then You may not access the Service.
          </p>
          <p>
            You represent that you are over the age of 18. The Company does not
            permit those under 18 to use the Service.
          </p>
          <p>
            Your access to and use of the Service is also conditioned on Your
            acceptance of and compliance with the Privacy Policy of the Company.
            Our Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your personal information when You
            use the Application or the Website and tells You about Your privacy
            rights and how the law protects You. Please read Our Privacy Policy
            carefully before using Our Service.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            Links to Other Websites
          </h2>
          <p>
            Our Service may contain links to third-party web sites or services
            that are not owned or controlled by the Company.
          </p>
          <p>
            The Company has no control over, and assumes no responsibility for,
            the content, privacy policies, or practices of any third party web
            sites or services. You further acknowledge and agree that the
            Company shall not be responsible or liable, directly or indirectly,
            for any damage or loss caused or alleged to be caused by or in
            connection with the use of or reliance on any such content, goods or
            services available on or through any such web sites or services.
          </p>
          <p>
            We strongly advise You to read the terms and conditions and privacy
            policies of any third-party web sites or services that You visit.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">Termination</h2>
          <p>
            We may terminate or suspend Your access immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if You breach these Terms and Conditions.
          </p>
          <p>
            Upon termination, Your right to use the Service will cease
            immediately.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            Limitation of Liability
          </h2>
          <p>
            Notwithstanding any damages that You might incur, the entire
            liability of the Company and any of its suppliers under any
            provision of this Terms and Your exclusive remedy for all of the
            foregoing shall be limited to the amount actually paid by You
            through the Service or 100 USD if You haven't purchased anything
            through the Service.
          </p>
          <p>
            To the maximum extent permitted by applicable law, in no event shall
            the Company or its suppliers be liable for any special, incidental,
            indirect, or consequential damages whatsoever (including, but not
            limited to, damages for loss of profits, loss of data or other
            information, for business interruption, for personal injury, loss of
            privacy arising out of or in any way related to the use of or
            inability to use the Service, third-party software and/or
            third-party hardware used with the Service, or otherwise in
            connection with any provision of this Terms), even if the Company or
            any supplier has been advised of the possibility of such damages and
            even if the remedy fails of its essential purpose.
          </p>
          <p>
            Some states do not allow the exclusion of implied warranties or
            limitation of liability for incidental or consequential damages,
            which means that some of the above limitations may not apply. In
            these states, each party's liability will be limited to the greatest
            extent permitted by law.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            "AS IS" and "AS AVAILABLE" Disclaimer
          </h2>
          <p>
            The Service is provided to You "AS IS" and "AS AVAILABLE" and with
            all faults and defects without warranty of any kind. To the maximum
            extent permitted under applicable law, the Company, on its own
            behalf and on behalf of its Affiliates and its and their respective
            licensors and service providers, expressly disclaims all warranties,
            whether express, implied, statutory or otherwise, with respect to
            the Service, including all implied warranties of merchantability,
            fitness for a particular purpose, title and non-infringement, and
            warranties that may arise out of course of dealing, course of
            performance, usage or trade practice. Without limitation to the
            foregoing, the Company provides no warranty or undertaking, and
            makes no representation of any kind that the Service will meet Your
            requirements, achieve any intended results, be compatible or work
            with any other software, applications, systems or services, operate
            without interruption, meet any performance or reliability standards
            or be error free or that any errors or defects can or will be
            corrected.
          </p>
          <p>
            Without limiting the foregoing, neither the Company nor any of the
            company's provider makes any representation or warranty of any kind,
            express or implied: (i) as to the operation or availability of the
            Service, or the information, content, and materials or products
            included thereon; (ii) that the Service will be uninterrupted or
            error-free; (iii) as to the accuracy, reliability, or currency of
            any information or content provided through the Service; or (iv)
            that the Service, its servers, the content, or e-mails sent from or
            on behalf of the Company are free of viruses, scripts, trojan
            horses, worms, malware, timebombs or other harmful components.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain types of
            warranties or limitations on applicable statutory rights of a
            consumer, so some or all of the above exclusions and limitations may
            not apply to You. But in such a case the exclusions and limitations
            set forth in this section shall be applied to the greatest extent
            enforceable under applicable law.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">Governing Law</h2>
          <p>
            The laws of the Country, excluding its conflicts of law rules, shall
            govern this Terms and Your use of the Service. Your use of the
            Application may also be subject to other local, state, national, or
            international laws.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            Disputes Resolution
          </h2>
          <p>
            If You have any concern or dispute about the Service, You agree to
            first try to resolve the dispute informally by contacting the
            Company.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            For European Union (EU) Users
          </h2>
          <p>
            If You are a European Union consumer, you will benefit from any
            mandatory provisions of the law of the country in which you are
            resident in.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            United States Legal Compliance
          </h2>
          <p>
            You represent and warrant that (i) You are not located in a country
            that is subject to the United States government embargo, or that has
            been designated by the United States government as a "terrorist
            supporting" country, and (ii) You are not listed on any United
            States government list of prohibited or restricted parties.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            Severability and Waiver
          </h2>
          <h3>Severability</h3>
          <p>
            If any provision of these Terms is held to be unenforceable or
            invalid, such provision will be changed and interpreted to
            accomplish the objectives of such provision to the greatest extent
            possible under applicable law and the remaining provisions will
            continue in full force and effect.
          </p>
          <h3>Waiver</h3>
          <p>
            Except as provided herein, the failure to exercise a right or to
            require performance of an obligation under this Terms shall not
            effect a party's ability to exercise such right or require such
            performance at any time thereafter nor shall be the waiver of a
            breach constitute a waiver of any subsequent breach.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            Translation Interpretation
          </h2>
          <p>
            These Terms and Conditions may have been translated if We have made
            them available to You on our Service.
          </p>
          <p>
            You agree that the original English text shall prevail in the case
            of a dispute.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">
            Changes to These Terms and Conditions
          </h2>
          <p>
            We reserve the right, at Our sole discretion, to modify or replace
            these Terms at any time. If a revision is material We will make
            reasonable efforts to provide at least 30 days' notice prior to any
            new terms taking effect. What constitutes a material change will be
            determined at Our sole discretion.
          </p>
          <p>
            By continuing to access or use Our Service after those revisions
            become effective, You agree to be bound by the revised terms. If You
            do not agree to the new terms, in whole or in part, please stop
            using the website and the Service.
          </p>
          <h2 style="margin-top: 16px; margin-bottom: 16px">Contact Us</h2>
          <p style="color: #4b4c63; font-weight: 700">
            If you have any questions about these Terms and Conditions, You can
            contact us:
          </p>
          <p style="font-weight: 600">
            By email:
            <a
              style="color: #ff5722; font-weight: 600; text-decoration: none"
              href="mailto:support@citadel.one"
              >support@citadel.one</a
            >
          </p>
          <p style="font-weight: 600">Citadel.One PTE. LTD.</p>
          <p style="font-weight: 600">
            Terms and Conditions of
            <a style="color: #00a3ff" href="https://citadel.one"
              >https://citadel.one</a
            >
          </p>
          <p style="font-weight: 600; margin-bottom: 30px">
            Terms and Conditions Last updated:
            <b style="color: #54478f"
              >June 16, 2020 Please read these terms and conditions carefully
              before using Our Service.
            </b>
          </p>
          <p>
            Interpretation and Definitions Interpretation The words of which the
            initial letter is capitalized have meanings defined under the
            following conditions. The following definitions shall have the same
            meaning regardless of whether they appear in singular or in plural.
          </p>
          <p>
            Definitions For the purposes of these Terms and Conditions:
            Affiliate means an entity that controls, is controlled by or is
            under common control with a party, where "control" means ownership
            of 50% or more of the shares, equity interest or other securities
            entitled to vote for election of directors or other managing
            authority. Company (referred to as either "the Company", "We", "Us"
            or "Our" in this Agreement) refers to Citadel.One PTE. LTD., 160
            ROBINSON ROAD #24-09 SINGAPORE (068914).
          </p>
          <p>
            Country refers to: Singapore Device means any device that can access
            the Service such as a computer, a cellphone or a digital tablet.
            Service refers to the Website. Terms and Conditions (also referred
            as "Terms") mean these Terms and Conditions that form the entire
            agreement between You and the Company regarding the use of the
            Service. This Terms and Conditions agreement is maintained by the
            Free Terms and Conditions Generator. Third-party Social Media
            Service means any services or content (including data, information,
            products or services) provided by a third-party that may be
            displayed, included or made available by the Service. Website refers
            to Citadel.One, accessible from https://citadel.one You means the
            individual accessing or using the Service, or the company, or other
            legal entity on behalf of which such individual is accessing or
            using the Service, as applicable.
          </p>
          <p>
            Acknowledgement These are the Terms and Conditions governing the use
            of this Service and the agreement that operates between You and the
            Company. These Terms and Conditions set out the rights and
            obligations of all users regarding the use of the Service. Your
            access to and use of the Service is conditioned on Your acceptance
            of and compliance with these Terms and Conditions. These Terms and
            Conditions apply to all visitors, users and others who access or use
            the Service. By accessing or using the Service You agree to be bound
            by these Terms and Conditions. If You disagree with any part of
            these Terms and Conditions then You may not access the Service. You
            represent that you are over the age of 18. The Company does not
            permit those under 18 to use the Service. Your access to and use of
            the Service is also conditioned on Your acceptance of and compliance
            with the Privacy Policy of the Company. Our Privacy Policy describes
            Our policies and procedures on the collection, use and disclosure of
            Your personal information when You use the Application or the
            Website and tells You about Your privacy rights and how the law
            protects You. Please read Our Privacy Policy carefully before using
            Our Service.
          </p>
          <p>
            Links to Other Websites Our Service may contain links to third-party
            web sites or services that are not owned or controlled by the
            Company. The Company has no control over, and assumes no
            responsibility for, the content, privacy policies, or practices of
            any third party web sites or services. You further acknowledge and
            agree that the Company shall not be responsible or liable, directly
            or indirectly, for any damage or loss caused or alleged to be caused
            by or in connection with the use of or reliance on any such content,
            goods or services available on or through any such web sites or
            services. We strongly advise You to read the terms and conditions
            and privacy policies of any third-party web sites or services that
            You visit.
          </p>
          <p>
            Termination We may terminate or suspend Your access immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if You breach these Terms and
            Conditions. Upon termination, Your right to use the Service will
            cease immediately.
          </p>
          <p>
            Limitation of Liability Notwithstanding any damages that You might
            incur, the entire liability of the Company and any of its suppliers
            under any provision of this Terms and Your exclusive remedy for all
            of the foregoing shall be limited to the amount actually paid by You
            through the Service or 100 USD if You haven't purchased anything
            through the Service. To the maximum extent permitted by applicable
            law, in no event shall the Company or its suppliers be liable for
            any special, incidental, indirect, or consequential damages
            whatsoever (including, but not limited to, damages for loss of
            profits, loss of data or other information, for business
            interruption, for personal injury, loss of privacy arising out of or
            in any way related to the use of or inability to use the Service,
            third-party software and/or third-party hardware used with the
            Service, or otherwise in connection with any provision of this
            Terms), even if the Company or any supplier has been advised of the
            possibility of such damages and even if the remedy fails of its
            essential purpose. Some states do not allow the exclusion of implied
            warranties or limitation of liability for incidental or
            consequential damages, which means that some of the above
            limitations may not apply. In these states, each party's liability
            will be limited to the greatest extent permitted by law.
          </p>
          <p style="margin-bottom: 30px">
            "AS IS" and "AS AVAILABLE" Disclaimer The Service is provided to You
            "AS IS" and "AS AVAILABLE" and with all faults and defects without
            warranty of any kind. To the maximum extent permitted under
            applicable law, the Company, on its own behalf and on behalf of its
            Affiliates and its and their respective licensors and service
            providers, expressly disclaims all warranties, whether express,
            implied, statutory or otherwise, with respect to the Service,
            including all implied warranties of merchantability, fitness for a
            particular purpose, title and non-infringement, and warranties that
            may arise out of course of dealing, course of performance, usage or
            trade practice. Without limitation to the foregoing, the Company
            provides no warranty or undertaking, and makes no representation of
            any kind that the Service will meet Your requirements, achieve any
            intended results, be compatible or work with any other software,
            applications, systems or services, operate without interruption,
            meet any performance or reliability standards or be error free or
            that any errors or defects can or will be corrected. Without
            limiting the foregoing, neither the Company nor any of the company's
            provider makes any representation or warranty of any kind, express
            or implied: (i) as to the operation or availability of the Service,
            or the information, content, and materials or products included
            thereon; (ii) that the Service will be uninterrupted or error-free;
            (iii) as to the accuracy, reliability, or currency of any
            information or content provided through the Service; or (iv) that
            the Service, its servers, the content, or e-mails sent from or on
            behalf of the Company are free of viruses, scripts, trojan horses,
            worms, malware, timebombs or other harmful components. Some
            jurisdictions do not allow the exclusion of certain types of
            warranties or limitations on applicable statutory rights of a
            consumer, so some or all of the above exclusions and limitations may
            not apply to You. But in such a case the exclusions and limitations
            set forth in this section shall be applied to the greatest extent
            enforceable under applicable law. Governing Law The laws of the
            Country, excluding its conflicts of law rules, shall govern this
            Terms and Your use of the Service. Your use of the Application may
            also be subject to other local, state, national, or international
            laws. Disputes Resolution If You have any concern or dispute about
            the Service, You agree to first try to resolve the dispute
            informally by contacting the Company. For European Union (EU) Users
            If You are a European Union consumer, you will benefit from any
            mandatory provisions of the law of the country in which you are
            resident in. United States Legal Compliance
          </p>
          <p style="margin-bottom: 30px">
            You represent and warrant that (i) You are not located in a country
            that is subject to the United States government embargo, or that has
            been designated by the United States government as a "terrorist
            supporting" country, and (ii) You are not listed on any United
            States government list of prohibited or restricted parties.
          </p>
          <p style="margin-bottom: 30px">
            Severability and Waiver Severability If any provision of these Terms
            is held to be unenforceable or invalid, such provision will be
            changed and interpreted to accomplish the objectives of such
            provision to the greatest extent possible under applicable law and
            the remaining provisions will continue in full force and effect.
            Waiver Except as provided herein, the failure to exercise a right or
            to require performance of an obligation under this Terms shall not
            effect a party's ability to exercise such right or require such
            performance at any time thereafter nor shall be the waiver of a
            breach constitute a waiver of any subsequent breach. Translation
            Interpretation These Terms and Conditions may have been translated
            if We have made them available to You on our Service. You agree that
            the original English text shall prevail in the case of a dispute.
          </p>
          <p>
            Changes to These Terms and Conditions We reserve the right, at Our
            sole discretion, to modify or replace these Terms at any time. If a
            revision is material We will make reasonable efforts to provide at
            least 30 days' notice prior to any new terms taking effect. What
            constitutes a material change will be determined at Our sole
            discretion. By continuing to access or use Our Service after those
            revisions become effective, You agree to be bound by the revised
            terms. If You do not agree to the new terms, in whole or in part,
            please stop using the website and the Service.
          </p>
        </div>
      </ModalContent>
    </Modal>
  </teleport>
</template>
<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';

export default {
  components: {
    Modal,
    ModalContent,
  },
  emits: ['close'],
};
</script>
<style lang="scss" scoped>
.terms {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px;
  box-sizing: border-box;
  height: 500px;
  overflow-y: auto;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  color: #59779a;
  h1 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #000000;
    margin-bottom: 9px;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: Panton_Bold;
    margin: 0;
  }
  h2 {
    color: #1a53f0;
    text-transform: uppercase;
    font-size: 18px;
  }
  h3 {
    color: #00a3ff;
    margin-bottom: 8px;
    margin-top: 10px;
  }
  h4 {
    color: #4b4c63;
    font-weight: 700;
  }

  p {
    margin: 0;
    .bold {
      font-family: Panton_Bold;
    }
  }

  .bold {
    font-family: Panton_Bold;
  }
}
ul {
  padding-left: 30px;
  margin-top: 0;
  li p .bold {
    color: #4f70cf;
  }
  li h4 .bold {
    font-weight: 700;
    font-size: 16px;
    color: #000000 !important;
  }
  li {
    .type {
      color: #1a53f0;
    }
    .administered {
      color: #ff5722;
    }
  }
}
ul li::marker {
  color: #2970ff;
  font-size: 24px;
  line-height: 1;
}
</style>
