<template>
  <teleport to="body">
    <Modal>
      <ModalContent
        v-click-away="close"
        :button-text="$t('ok')"
        :submit-button="false"
        style="width: 1000px"
        @close="close"
      >
        <div class="policy">
          <h1>Privacy policy</h1>
          <br />
          <p>
            Citadel.one Ltd (<span class="bold">“Citadel.one”</span>,
            <span class="bold">“we”</span>, <span class="bold">“our”</span> or
            <span class="bold">“us”</span>) collects information about you from
            various sources to provide the Services to you, to protect our
            legitimate interests, to analyze and improve our Services, to
            communicate with you, and to comply with our legal and regulatory
            obligations. This Privacy Policy (<span class="bold"
              >“Privacy Policy”</span
            >) covers our treatment of the personally identifiable information
            that we gather when you access or use our Services.
          </p>
          <br />
          <p>
            From time to time, we may revise or amend this Privacy Policy to
            reflect changes in law, our Personal Data collection and use
            practices, the features of the Services, or advances in technology.
            This Privacy Policy does not cover the practices of entities we do
            not own or control, or people we do not manage.
          </p>
          <br />
          <p>
            Our Privacy Policy applies to all Services we offer, but excludes
            any products, applications or services that have separate privacy
            policies which do not incorporate this Privacy Policy. For the
            purposes of data protection laws of the European Union (<span
              class="bold"
              >“EU”</span
            >), and other relevant jurisdictions where Customers are located
            (<span class="bold">“Data Protection Laws”</span>), Citadel.one is a
            data controller (i.e., the company who is responsible for, and
            controls the processing of, your Personal Data).
          </p>
          <br />
          <p>
            The access and/or use of our Services implies acceptance of this
            Privacy Policy as well as the conditions and provisions included in
            the Terms of Use. The terms used in this Privacy Policy shall have
            the same meanings as in the Terms of Use except as otherwise
            provided herein. For the avoidance of doubt the term
            <span class="bold">“Services”</span> shall include the Website
            <a
              style="text-decoration: none; color: #00a3ff; font-weight: 600"
              href="https://citadel.one"
              target="_blank"
              >https://citadel.one</a
            >, the Platform and the services provided by Citadel.one as defined
            in the Terms of Use.
          </p>
          <br />
          <h2>What data we collect</h2>
          <p>
            To the fullest extent permitted under applicable Data Protection
            Laws, we may collect the following data and information
            (collectively, <span class="bold">“Personal Data”</span>):
          </p>
          <ul>
            <li>
              <p>
                Full name, country of residence, username, and data included in
                government-issued identification documents;
              </p>
            </li>
            <li><p>Distributed ledger network wallet addresses;</p></li>
            <li>
              <p>
                Information about how you access and use our Services, such as
                your actions on the Services, including your interactions with
                others on the Services, photos or media you upload to the
                Services, your username, and other User Content you provide.
              </p>
            </li>
            <li>
              <p>
                Communications between Citadel.one and you including emails,
                social media messages, job applications, customer support
                inquiries;
              </p>
            </li>
            <li>
              <p>
                Current and historical information concerning your geographic
                location, GPS location, transaction location, and IP addresses
                that you use when you use and/or access our Services. We may use
                third-party services such as the Google Maps API to gather
                information about your location. Google uses various
                technologies to determine your location, including IP address,
                GPS, and other sensors that may, for example, provide Google
                with information on nearby devices, Wi-Fi access points, and
                cell towers (see Google’s
                <a
                  style="
                    text-decoration: none;
                    color: #00a3ff;
                    font-weight: 600;
                  "
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  >Privacy Policy</a
                >
                to learn more);
              </p>
            </li>
            <li>
              <p>
                Information about your device and its software, such as your IP
                address, browser type, Internet service provider, platform type,
                device type, operating system, date and time stamp, a unique ID
                (that allows us to uniquely identify your browser, mobile
                device, or your account), and other similar information.
              </p>
            </li>
          </ul>
          <br />
          <p>
            We may monitor, record, and store your personal information in order
            to protect your safety or the safety of other users, comply with
            relevant laws, to assist with regulatory or law enforcement efforts,
            to protect and defend our rights and property, or for other reasons
            relating to our provision of the Services. By using the Services,
            you consent to the recording, storage, and disclosure of such
            information you send or receive for these purposes. For the
            avoidance of doubt, Citadel.one will never store passwords, private
            keys, or seed phrases of Non-Custodial Wallets created by Users
            through our Services.
          </p>
          <br />
          <p>
            The Services are not available to anyone under the age of eighteen
            (18) (<span class="bold">“Minors”</span>). Citadel.one will never
            knowingly and intentionally collect Personal Data from Minors. If
            you are a parent or guardian of a Minor and you believe or are aware
            that a Minor has provided us with Personal Data, please contact us
            immediately. If we become aware that we have collected Personal Data
            from Minors with or without verification of parental consent, we
            will take measures to delete that information from our systems.
          </p>
          <br />
          <h2>How we collect Personal Data</h2>
          <p>
            To the fullest extent permitted under applicable Data Protection
            Laws, we collect Personal Data about you and any other party whose
            details you provide to us when you:
          </p>
          <ul>
            <li><p>Access or use our Services;</p></li>
            <li><p>Create an account;</p></li>
            <li>
              <p>
                Complete online forms (including call back requests), take part
                in surveys, post on any forums, download information such as
                white papers or other publications or participate in any other
                interactive areas that appear within our Services;
              </p>
            </li>
            <li><p>Interact with us using social media;</p></li>
            <li>
              <p>
                Provide your contact details to us when registering to use or
                access any services we make available or when you update those
                details; and
              </p>
            </li>
            <li>
              <p>Contact us or otherwise connect with us, online or offline.</p>
            </li>
          </ul>
          <br />
          <p>
            We will also collect Personal Data where you only partially complete
            and/or abandon any information inputted through our Services and/or
            other online forms and may use this information to contact you to
            remind you to complete any outstanding information and/or for
            marketing purposes.
          </p>
          <br />
          <p>
            We may also collect information from your devices (including mobile
            devices) and applications you or your users use to access and use
            our Services (for example, we may collect the device identification
            number and type, location information and connection information
            such as statistics on your page views, traffic to and from the
            Services, referral URL, ad data, your Internet Protocol (IP)
            address, your browsing history and your web log information) and we
            will ask for your permission before we do so. We may do this using
            cookies or similar technologies (as described below).
          </p>
          <br />
          <p>
            If you intend to give us Personal Data about someone else, you are
            responsible for ensuring that you comply with any obligation and
            consent obligations under applicable Data Protections Laws. Insofar
            as required by applicable Data Protection Laws, you must ensure that
            beforehand you have their explicit consent to do so and that you
            explain to them how we collect, use, disclose and retain their
            Personal Data, or direct them to read our Privacy Policy.
          </p>
          <br />
          <h2>How we use your Personal Data</h2>
          <p>
            To the fullest extent permitted under applicable under Data
            Protection Laws, we use your information to:
          </p>
          <ul>
            <li>
              <p>
                Provide any information or Services that you have requested or
                ordered;
              </p>
            </li>
            <li>
              <p>
                Compare information for accuracy and to verify it with third
                parties;
              </p>
            </li>
            <li><p>Provide, maintain, protect and improve our Services;</p></li>
            <li>
              <p>
                Manage, monitor, and administer your use of the Services and
                provide an enhanced, personal, user experience;
              </p>
            </li>
            <li>
              <p>
                Manage our relationship with you (for example, customer services
                and technical support activities);
              </p>
            </li>
            <li>
              <p>
                Undertake internal testing of the Services or systems to test
                and improve their security and performance (in these
                circumstances, we would de-identify any information used for
                such testing purposes);
              </p>
            </li>
            <li>
              <p>
                Provide you with any information that we are required to send
                you to comply with our regulatory or legal obligations;
              </p>
            </li>
            <li>
              <p>
                Detect, prevent, investigate or remediate, crime, illegal or
                Prohibited Activities or to otherwise protect our legal rights
                (including liaison with regulators and law enforcement agencies
                for these purposes);
              </p>
            </li>
            <li>
              <p>
                Contact you to see if you would like to take part in our
                customer research (for example, feedback on your use of our
                Services);
              </p>
            </li>
            <li>
              <p>
                Monitor, carry out statistical analysis and benchmarking
                (provided that in such circumstances it is on an aggregated
                basis which will not be linked back to you or any living
                individual);
              </p>
            </li>
            <li>
              <p>
                Deliver advertising, marketing (including but not limited to
                in-product messaging) or information which may be useful to you;
              </p>
            </li>
            <li>
              <p>
                Deliver joint content and services with third parties with whom
                you have a separate relationship (for example, social media
                providers); and
              </p>
            </li>
            <li>
              <p>
                In addition to the legal and commercial uses listed above, we
                may be required to provide any and all of your Personal Data to
                governmental authorities as necessary to comply with the law. To
                the extent required by Data Protection Laws, or where we have a
                legitimate and lawful purpose for doing so, we retain
                information about you after your withdrawal of funds through the
                Services, the closure of your Account, if the registration of an
                Account is declined or if you decide not to proceed with the
                registration of an Account.
              </p>
            </li>
          </ul>
          <br />
          <p>Our Services may contain technology that enables us to:</p>
          <br />
          <ul>
            <li>
              <p>
                Check specific information from your device or systems directly
                relevant to your use of the Services, applications or Services
                against our records to make sure the Services services are being
                used in accordance with our end-user agreements and to
                troubleshoot any problems;
              </p>
            </li>
            <li>
              <p>
                Obtain information relating to any technical errors or other
                issues with our Services;
              </p>
            </li>
            <li>
              <p>
                Collect information about how you use the features of our
                Services; and
              </p>
            </li>
            <li>
              <p>
                Gather statistical information about the operating system and
                environment from which you access our Services.
              </p>
            </li>
          </ul>
          <br />
          <p>
            If you become a follower in Citadel.one's social networks, the
            processing of Personal Data will be governed by the policies of the
            Social Network, as well as by their terms of use, privacy policies
            and regulations that belong to the social network that corresponds
            in each case and that you have previously accepted.
          </p>
          <br />
          <p>
            Citadel.one will treat your Personal Data in order to correctly
            manage your presence in the social network, inform him of
            Citadel.one activities, Services, as well as for any other purpose
            that the rules of the social networks allow.
          </p>
          <br />
          <p>
            In no case will Citadel.one use the profiles of followers in social
            networks to send advertising individually.
          </p>
          <br />
          <h2>Parties with whom we may share your Personal Data</h2>
          <p>We may share your Personal Data with:</p>
          <ul>
            <li>
              <p>
                Third-Party Internet and Marketing Services Vendors such as
                Active Campaign, Facebook, Discord, Telegram, GoogleCloud,
                Google Analytics, Mixpanel, Sentry;
              </p>
            </li>
            <li>
              <p>
                Government and State Authorities to respond to subpoenas, court
                orders, legal process, law-enforcement requests, legal claims,
                or government inquiries and to protect and defend the rights,
                interests, safety, and security of Citadel.one, our affiliates,
                Customers, or the public;
              </p>
            </li>
            <li>
              <p>
                Citadel.one Entities and Citadel.one’s Affiliated Entities, as
                defined in the Terms of Use;
              </p>
            </li>
            <li>
              <p>
                Third-Parties in connection to corporate transactions such as
                the sale of a website, a merger, consolidation, reorganization,
                financing, change or control or acquisition of all or a portion
                of our business by another company or third party, asset sale,
                initial public offering, or in the unlikely event of bankruptcy
                or similar proceeding.
              </p>
            </li>
          </ul>
          <br />
          <h2>Data Retention</h2>
          <p>
            We will retain your Personal Data for as long as it is necessary for
            the purposes of performing a contract, comply with our legal
            obligations, and protect our legitimate interests.
          </p>
          <br />
          <h2>Persons who may access your Personal Data</h2>
          <p>
            Citadel.one’s authorized personnel, including but not limited to our
            Compliance Officers, shall have access to your Personal Data on a
            need-to-know basis. Our Compliance Officers and other authorized
            personnel are bound to confidentiality and non-disclosure
            agreements, and subject to strict company policies related to the
            access and use of the data.
          </p>
          <br />
          <p>
            We may engage from time to time to third-party service providers.
            Where applicable, we will enter into a data processing agreement
            with these third-parties to ensure data security and protection of
            your Personal Data against Data Beaches. Such Data Processors will
            only process your Personal Data to the extent required for the
            provision of services for which they are engaged.
          </p>
          <br />
          <p>
            We may provide your Personal Data to competent authorities upon
            their request to the extent legally required or to the extent
            necessary to defend our rights in legal proceedings or
            investigations.
          </p>
          <br />
          <h2>Data Security</h2>
          <p>
            To protect your Personal Data, Citadel.one takes all reasonable
            precautions and follows the best practices of the industry to
            prevent the loss, misuse, improper access, disclosure, alteration or
            destruction of the same.
          </p>
          <br />
          <p>
            In addition to the purposes described in this section, we may also
            use information we gather to deliver targeted and interest-based
            advertising, marketing (including in-product messaging) or
            information to you which may be useful, based on your use of the
            Services or any other information we have about you (depending on
            the Services, you may able to configure these features to suit your
            preferences).
          </p>
          <br />
          <h2>Legal basis for processing in the EU</h2>
          <p>
            In the EU, we collect your Personal Data for the following purposes:
          </p>
          <ul>
            <li>
              <p>
                Based on your consent, for marketing purposes, which can be
                revoked at any time;
              </p>
            </li>
            <li>
              <p>
                Where necessary to perform any contract we enter into, or have
                entered into, with you to provide Services or provide access to
                our Services;
              </p>
            </li>
            <li>
              <p>
                Where necessary for our legitimate business interests (or those
                of a third party) when your interests and fundamental rights do
                not override those interests; and
              </p>
            </li>
            <li>
              <p>
                Where we need to comply with a legal or regulatory obligation
                either in the EU or elsewhere.
              </p>
            </li>
          </ul>
          <br />
          <p>You have the following rights:</p>
          <ul>
            <li><p>The right to access your own Personal Data;</p></li>
            <li>
              <p>
                The right to have your Personal Data rectified if it is
                inaccurate or incomplete;
              </p>
            </li>
            <li>
              <p>
                The right to request deletion or removal of your Personal Data
                where there is no good reason for processing to continue;
              </p>
            </li>
            <li>
              <p>
                The right to restrict processing of your Personal Data where
                there is no good reason for processing to continue;
              </p>
            </li>
            <li>
              <p>
                The right to data portability to enable moving, copying or
                transferring of Personal Data from one platform to another;
              </p>
            </li>
            <li>
              <p>
                The right to object to the processing of your Personal Data in
                certain circumstances; and
              </p>
            </li>
            <li>
              <p>
                Rights relating to profiling and automated decision making
                resulting from the processing of your Personal Data.
              </p>
            </li>
          </ul>
          <br />
          <p>
            The exercise of these rights is personal and therefore must be
            exercised directly by the interested party, requesting it directly
            to Citadel.one, which means that any Customer, user, subscriber or
            collaborator who has provided their data at any time can contact
            Citadel.one and request information about the data that it has
            stored and how it has been obtained, request the rectification of
            the same, request the portability of your Personal Data, oppose the
            processing, limit its use or request the cancellation of that data
            in Citadel.one's files.
          </p>
          <br />
          <p>
            To exercise the rights of access, rectification, cancellation,
            portability and opposition, you must send an email to the Data
            Protection Officer of Citadel.one
            <a class="social-link" href="mailto:info@citadel.one"
              >info@citadel.one</a
            >
            together with a valid proof of identity such as a Government-issued
            ID document.
          </p>
          <br />
          <h2>Content from other Services</h2>
          <p>
            The Services may include embedded content (for example, videos,
            images, articles, etc.). The embedded content of other internet
            websites behaves in exactly the same way as if you had visited other
            internet websites.
          </p>
          <br />
          <p>
            These internet websites may collect data about you, use cookies,
            embed an additional third-party tracking code, and monitor your
            interaction using this code.
          </p>
          <br />
          <h2>Cookies policy</h2>
          <p>
            Our Services use cookies. By accessing our Services we will inform
            you, through a pop-up banner, of our use of cookies.
          </p>
          <ul>
            <li>
              <p>About cookies</p>
              <p>
                Cookies are files, often with unique identifiers, that web
                servers send to Internet browsers and can then be sent back to
                the server each time the browser requests a page from the
                server.Web servers use cookies to identify and track users while
                browsing the different pages of Services, as well as to identify
                users returning to Services.
              </p>
              <p>
                Cookies can be “persistent” cookies or “session cookies”. A
                persistent cookie consists of a text file sent by a web server
                to an Internet browser, which is stored by the browser and
                remains valid until the defined expiration date (unless the user
                deletes it before the expiration date ). On the other hand, a
                session cookie expires at the end of the user's session, when
                the Internet browser is closed.
              </p>
            </li>
            <li>
              <p>Cookies from the Services</p>
              <p>
                On our Services, including our Website, and mobile applications,
                we use session and persistent cookies.
              </p>
              <p>We will send you the following cookies:</p>
              <p style="margin-left: 15px">a. Session Cookies</p>
              <p style="margin-left: 15px">
                b. Google Analytics, Sentry: This cookie allows us to identify
                unique users, unique sessions, regulate the rate of requests and
                store information about user sessions and campaigns.
              </p>
              <p>
                Cookie 1 is a session cookie, while Cookie 2 is a persistent
                cookie.
              </p>
            </li>
            <li>
              <p>How we use cookies</p>
              <p>
                Cookies do not contain personally identifiable information, but
                we have the possibility of linking the Personal Data we store
                about you with the information obtained and stored from
                cookies.We use the information we obtain from the use of our
                cookies for the following purposes:
              </p>
              <p style="margin-left: 15px">
                a. Recognize your computer when you access and/or use our
                Services.
              </p>
              <p style="margin-left: 15px">
                b. Improve the usability of the Services.
              </p>
              <p style="margin-left: 15px">
                c. Analyze the use of our Services.
              </p>
              <p style="margin-left: 15px">d. Manage the Services.</p>
              <p style="margin-left: 15px">e. Third party cookies</p>
              <p>
                When you use the Services, you may also be sent third-party
                cookies.
              </p>
              <p>
                Our service providers can send you cookies. They use the
                information they obtain through their cookies for the following
                purposes:
              </p>
              <p style="margin-left: 15px">
                a. Track your browser on different Services.
              </p>
              <p style="margin-left: 15px">
                b. Create a profile of your Internet browsing.
              </p>
              <p style="margin-left: 15px">
                c. Select specific ads that may be of interest.
              </p>
            </li>
            <li>
              <p>Deletion and blocking of cookies</p>
              <p>
                You can, at any time, restrict, block or delete cookies from the
                Services. To do this, you must modify the configuration of your
                browser regarding the use of cookies through the “Preferences”,
                “Options” or “Tools” menu (the name of the menus or the
                procedure to access the cookie options vary depending on the
                browser used). Most browsers allow you to refuse to accept
                cookies and to delete cookies. The methods for doing so vary
                from browser to browser, and from version to version. You can
                however obtain up-to-date information about blocking and
                deleting cookies via these links:
              </p>
              <ul>
                <li>
                  <p>
                    <a
                      class="social-link"
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      >https://support.google.com/chrome/answer/95647</a
                    >
                    (Chrome);
                  </p>
                </li>
                <li>
                  <p>
                    <a
                      class="social-link"
                      href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                      target="_blank"
                      >https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences</a
                    >
                    (Firefox);
                  </p>
                </li>
                <li>
                  <p>
                    <a
                      class="social-link"
                      href="https://help.opera.com/en/latest/security-and-privacy/"
                      target="_blank"
                      >https://help.opera.com/en/latest/security-and-privacy/</a
                    >
                    (Opera);
                  </p>
                </li>
                <li>
                  <p>
                    <a
                      class="social-link"
                      href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies"
                      target="_blank"
                      >https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies</a
                    >
                    (Internet Explorer);
                  </p>
                </li>
                <li>
                  <p>
                    <a
                      class="social-link"
                      href="https://support.apple.com/en-gb/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                      target="_blank"
                      >https://support.apple.com/en-gb/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a
                    >
                    (Safari); and
                  </p>
                </li>
                <li>
                  <p>
                    <a
                      class="social-link"
                      href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy"
                      target="_blank"
                      >https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy</a
                    >
                    (Edge).
                  </p>
                </li>
              </ul>
            </li>
          </ul>
          <br />
          <h2>Navigation</h2>
          <p>
            When accessing and/or using the Services, non-identifying data may
            be collected, which may include the IP address, geolocation, a
            record of how services and Services are used, browsing habits and
            other data that cannot be used to identify the User.
          </p>
          <br />
          <p>
            The Services use the following third-party analysis services: Google
            Analytics
          </p>
          <br />
          <p>
            Citadel.one uses the information obtained to obtain statistical
            data, analyze trends, administer the Services, study navigation
            patterns and to gather demographic information.
          </p>
          <br />
          <h2>Accuracy and veracity of Personal Data</h2>
          <br />
          <p>
            You agree that the information provided to Citadel.one is correct,
            complete, accurate and current. You are solely responsible for the
            veracity and correctness of the data you submit when access and/or
            using the Services, exonerating Citadel.one from any responsibility
            in this regard.
          </p>
          <br />
          <h2>Acceptance and consent</h2>
          <p>
            You declare to have been informed of the conditions on protection of
            Personal Data, You accept and consent to the treatment of the same
            by Citadel.one in the manner and for the purposes indicated in this
            Privacy Policy.
          </p>
          <br />
          <h2>Revocability</h2>
          <p>
            To exercise the rights of access, rectification, cancellation,
            portability and opposition, you must send an email to
            <a class="social-link" href="mailto:info@citadel.one"
              >info@citadel.one</a
            >
            along with your valid proof of ID such as a Government-issued
            identification document. The exercise of your rights do not include
            any Personal Data that Citadel.one is obliged to keep for
            administrative, performance of contracts, legal or security
            purposes.
          </p>
          <br />
          <h2>Change of Operatorship</h2>
          <p>
            In case of incorporation, acquisition, merger or any other causes
            that cause the change of Operatorship of the Services, you expressly
            consent that your registration data and information are transferred
            by Citadel.one to the new Operator. When and if this occurs,
            Citadel.one will comply, in any case, with the duty of information
            to you.
          </p>
          <br />
          <h2>Changes to the Privacy Policy</h2>
          <p>
            Citadel.one reserves the right to modify this Privacy Policy to
            adapt it to legislative developments, as well as to industry
            practices. Citadel.one may notify you of changes to this Privacy
            Policy by email or through the Services.
          </p>
          <br />
          <h2>Services Operator</h2>
          <p>
            The Services are operated by Citadel.one, a BVI business company
            with its registered office address at Intershore Chambers, Road
            Town, Tortola, BVI.
          </p>
          <br />
          <h2>Contact</h2>
          <p>
            In case you have any questions or complaints about the Privacy
            Policy, you can contact our data protection officer via email to
            <a class="social-link" href="mailto:info@citadel.one"
              >info@citadel.one</a
            >
          </p>
        </div>
      </ModalContent>
    </Modal>
  </teleport>
</template>
<script>
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
export default {
  components: {
    Modal,
    ModalContent,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter();
    const close = () => {
      emit('close');
      if (router.currentRoute.value.name === 'modalPrivacy') {
        router.push('/');
      }
    };
    return {
      close,
    };
  },
};
</script>
<style lang="scss" scoped>
.policy {
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

  .social-link {
    text-decoration: none;
    color: #00a3ff;
    font-weight: 600;
  }

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
