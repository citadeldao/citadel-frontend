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
        <div class="terms">
          <h1>Terms and Conditions</h1>
          <br />
          <p>
            THESE TERMS OF USE (these <span class="bold">“Terms”</span>), is a
            legal and binding contract between Citadel.one Ltd, a BVI Business
            Company incorporated under the BVI Business Companies Act, 2004 (As
            Amended) with BVI Business Company Number 2047892 and with
            registered office address at Intershore Chambers, P.O. Box 4342,
            Road Town, Tortola, British Virgin Islands , its successors and
            assigns (hereinafter <span class="bold">"Citadel.one"</span>,
            <span class="bold">“our”</span>, <span class="bold">“us”</span> or
            <span class="bold">“we”</span>), and the party or parties (the
            <span class="bold">"User"</span>, or
            <span class="bold">“you”</span>) using the Services (as defined
            herein) available in the Citadel.one Platform (as defined herein).
          </p>
          <br />
          <p>
            The information in these Terms does not constitute a recommendation
            by Citadel.one, or any other person, to use the Services. The
            information in these Terms do not necessarily identify, or purport
            to identify, all the risk factors associated with using the
            Services. Users must make their own independent assessment, after
            making such investigations as they consider necessary, of the merits
            of using the Services. Users should consult and rely upon their
            accounting, legal and tax representatives and advisers in order to
            evaluate the economic, legal and tax consequences of using the
            Services.
          </p>
          <br />
          <p>
            Users must also investigate themselves as to the regulations within
            the countries of their nationality, residence, ordinary residence or
            domicile regarding the use of the Services, including, but not
            limited to, restrictions or regulations regarding buying, holding,
            trading or disposing of cryptographic coins/tokens or virtual
            currencies in general.
            <span class="bold"
              >Citadel.one does not offer to use the Services in any
              jurisdiction or to any person to whom it is unlawful to make such
              an offer or solicitation in such jurisdiction.</span
            >
          </p>
          <br />
          <p>
            In the event of any dispute between Citadel.one and a User, such
            dispute shall be determined pursuant to the arbitration provision
            detailed in Article 17 "Submission to Arbitration" and Article 18
            "Waiver of Class Action Rights and Class Wide Arbitration".
          </p>
          <br />
          <p>
            Citadel.one reserves the right, at its sole discretion, to modify or
            replace these Terms at any time, with or without notice to the User.
            Any such modification will be effective immediately upon public
            posting. Your continued use of the Services following any such
            modification constitutes your acceptance of these modified Terms. If
            you do not agree to any modification to these Terms, you must stop
            using the Services. Citadel.one encourages you to frequently review
            the Terms to ensure you understand the terms and conditions that
            apply to your use of the Services and acquisition of Tokens.
          </p>
          <br />
          <h2>1. DEFINITIONS; INTERPRETATION</h2>
          <h3>1.1. Definitions</h3>
          <br />
          <p>
            <span class="bold">“Applicable Law”</span> means all relevant or
            applicable statutes, laws (including any reporting and/or
            withholding tax requirements of any government), rules, regulations,
            directives, circulars, notices, guidelines and practice notes of any
            Governmental Authority of the British Virgin Islands.
          </p>
          <br />
          <p>
            <span class="bold">"APIs"</span> means Application Programming
            Interfaces.
          </p>
          <br />
          <p>
            <span class="bold">“Affiliated Entities”</span> includes, but is not
            limited to, any partnership, corporation, limited liability company,
            trust, or other entity or association, directly or indirectly,
            through one or more intermediaries, controlling, controlled by, or
            under common control with, Citadel.one. The term “control” as used
            in the immediately preceding sentence means, with respect to a
            corporation, the right to exercise, directly or indirectly, more
            than 25% of the voting rights attributable to the controlled
            corporation or limited liability company, and, with respect to any
            partnership, trust, other entity or association, the possession,
            directly or indirectly, of the power to direct or cause the
            direction of the management or policies of the controlled entity.
          </p>
          <br />
          <p>
            <span class="bold">“Citadel.one”</span> means Citadel.one Ltd, a BVI
            Business Company incorporated under the BVI Business Companies Act,
            2004, its successors and assigns.
          </p>
          <br />
          <p>
            <span class="bold">"Citadel.one Parties"</span> means Citadel.one,
            the Affiliated Entities and their parent companies, subsidiaries,
            affiliates, agents, representatives, predecessors, advisors, and the
            successors and assigns of each of the foregoing.
          </p>
          <br />
          <p>
            <span class="bold">“Citadel.one Platform”</span> or
            <span class="bold">“Platform”</span> means the software applications
            within the Citadel.one Platform available at the Website from time
            to time.
          </p>
          <br />
          <p>
            <span class="bold">“Content”</span> means any data or information or
            documents or images on the Website, the Platform and its related
            sites and mobile applications, data available through any APIs, and
            any information, documents or images on Citadel.one accounts in any
            third-party social media platforms, including but not limited to
            Twitter, Instagram, Telegram, Facebook, Discord, Github, Medium,
            YouTube, and Reddit.
          </p>
          <br />
          <p>
            <span class="bold">“Delegate”</span> or
            <span class="bold">“Delegated”</span> means exercising Voting Rights
            and Validation Rights associated with a Supported Network’s Virtual
            Assets held by the User through the Nodes owned, operated and
            maintained by Citadel.one.
          </p>
          <br />
          <p>
            <span class="bold">“Intellectual Property Rights”</span> shall
            include, but not limited to, any registered or unregistered patents,
            database rights, data protection rights, trademarks, trade secrets,
            trade names, corporate names, service marks, tag lines and
            descriptors, domain names, design, structure, layouts, graphical
            images, typography, color palettes, and copyrightable works,
            including but not limited to software applications, underlying
            source code, stationery, signage, promotional items, advertising and
            marketing materials, press releases, photographs, forms, and
            electronic media.
          </p>
          <br />
          <p>
            <span class="bold">“Net Rewards”</span> means Rewards minus any
            Penalties.
          </p>
          <br />
          <p>
            <span class="bold">“Penalties”</span> means any penalty or reduction
            of Rewards applied by the Supported Network.
          </p>
          <br />
          <p>
            <span class="bold">“Proof-of-Stake Network”</span> means a
            blockchain ledger in which transactions in Virtual Assets are
            recorded as a result of the activities of a distributed,
            peer-to-peer network of software clients (<span class="bold"
              >“Nodes”</span
            >) that reach a Proof-of-Stake consensus.
          </p>
          <br />
          <p>
            <span class="bold">"Privacy Policy"</span> means the privacy policy
            of Citadel.one available at https://citadel.one
          </p>
          <br />
          <p>
            <span class="bold">“Prohibited Jurisdiction”</span> means (i) the
            United States, the Province of Ontario of Canada, the People’s
            Republic of China, Afghanistan, Belarus, Central African Republic,
            Congo, Democratic Republic of the Congo, Republic of the Cote
            D'Ivoire, Crimea (a region of Ukraine annexed by the Russian
            Federation), the self-proclaimed Donetsk People’s Republic (a region
            of Ukraine), the self-proclaimed Luhansk People’s Republic (a region
            of Ukraine), Kherson Oblast (a region of Ukraine), Zaporizhzhia
            Oblast (a region of Ukraine), Cuba, El Salvador, Eswatini, Gambia,
            Iran, Iraq, Liberia, Libya, Malawi, Mali, Moldova, Myanmar, Niger,
            North Korea, Palestinian Territory, South Sudan, Sudan, Syria,
            Venezuela, Yemen, Zambia, Zimbabwe; (ii) any state, country or other
            jurisdiction that is sanctioned and/or embargoed by the United
            States of America, the United Nations, the United Kingdom, the
            European Union and/or Switzerland; (iii) a jurisdiction where it
            would be illegal according to local law or regulation for you to
            purchase Tokens; or (iv) where the distribution and sale of virtual
            assets or Tokens is prohibited or contrary to local law or
            regulation, or could subject the Company Parties to any local
            registration, regulatory or licensing requirements.
          </p>
          <br />
          <p>
            <span class="bold">“Rewards”</span> means Virtual Assets that are
            either newly minted as an increase of the total supply of a
            Supported Network or as a result of the transaction fees from the
            transactions validated by exercising Validation Rights.
          </p>
          <br />
          <p>
            <span class="bold">“Services”</span> means the Website, the
            Platform, and services available in the Platform as described in
            Section 2 of these Terms, and any other services and applications
            available in the Citadel.one Platform from time to time.
          </p>
          <br />
          <p>
            <span class="bold">“Staking”</span> or
            <span class="bold">“to Stake”</span> means to Delegate Virtual
            Assets to Citadel.one to exercise Token Rights.
          </p>
          <br />
          <p>
            <span class="bold">“Supported Network”</span> means a Proof-of-Stake
            Network on which Citadel.one may exercise Token Rights delegated to
            it by the User.
          </p>
          <br />
          <p>
            <span class="bold">“Supported Network Protocol”</span> means the
            rules by which the Supported Network operates including but not
            limited to the process for Staking, the quantity and timing of
            Rewards, and the conditions under which Penalties are imposed.
          </p>
          <br />
          <p>
            <span class="bold">"Terms"</span> means these Terms of Use and the
            Privacy Policy, including all exhibits and any amendments and
            supplements thereto.
          </p>
          <br />
          <p>
            <span class="bold">“Token Rights”</span> mean Validation Rights and
            Voting Rights.
          </p>
          <br />
          <p>
            <span class="bold">“User Content”</span> shall mean any content,
            feedback, suggestions, ideas, or other information or materials
            about Citadel.one, or the Platform or the Services, that you provide
            to Citadel.one through the Website, the Services, or any other means
            including but not limited to blogs, message boards, forums and APIs
            (whether or not submitted through a third party).
          </p>
          <br />
          <p>
            <span class="bold">"U.S. Person"</span> means a citizen or resident
            of the United States, a corporation (or other entity treated as a
            corporation for United States federal income tax purposes) created
            or organized in the United States or any political subdivision
            thereof, an estate the income of which is subject to United States
            federal income taxation regardless of its source, a partnership or
            limited liability company or other entity created or organized in or
            under the laws of the United States, a trust if (i) a court within
            the United States is able to exercise primary supervision over the
            administration of the trust and one or more United States
            fiduciaries have the authority to control all substantial decisions
            of the trust or (ii) the trust properly elected to be treated as a
            US Person, or any person falling within the definition of the term
            "United States Person" under the 1933 Act or under any other
            applicable rules or regulations.
          </p>
          <br />
          <p>
            <span class="bold">"United States"</span> means the United States of
            America (including the States and District of Columbia) and any of
            its territories, possessions and other areas subject to its
            jurisdiction.
          </p>
          <br />
          <p>
            <span class="bold">"User"</span> means any person or entity using
            the Services. Collectively, such persons or entities shall be
            referred to as the <span class="bold">"Users."</span>
          </p>
          <br />
          <p>
            <span class="bold">“Voting Rights”</span> means the ability to vote
            for holders of Virtual Assets of a specific Supported Network upon
            proposals related to the operation and governance of such Supported
            Network.
          </p>
          <br />
          <p>
            <span class="bold">“Validation Rights”</span> mean a limited license
            on the Supported Network for the holder of native Virtual Assets of
            such Supported Network to validate and propose the addition of
            blocks to the Supported Network.
          </p>
          <br />
          <p>
            <span class="bold">“Virtual Assets”</span> means encrypted
            currencies or digital assets or digital tokens or virtual currencies
            or cryptocurrencies which are based on distributed ledger technology
            and can be digitally traded, which are used or traded in connection
            with the Platform.
          </p>
          <br />
          <p>
            <span class="bold">“Website”</span> means https://citadel.one, any
            API located at https://citadel.one and any direct subdomain of
            https://citadel.one, and any content or software application made
            available through https://citadel.one, and all downloadable
            materials.
          </p>
          <br />
          <p>
            <span class="bold">"XCT Tokens"</span> means the cryptographic
            tokens named XCT, and utilizing the symbol "XCT".
          </p>
          <br />
          <h3>1.2. Interpretation; Translations</h3>
          <p class="ml-15">
            In these Terms, unless the context otherwise requires:
          </p>
          <p class="ml-15">
            (a) words importing the singular include the plural and vice versa;
          </p>
          <p class="ml-15">
            (b) words which are gender neutral or gender specific include each
            gender;
          </p>
          <p class="ml-15">
            (c) other parts of speech and grammatical forms of a word or phrase
            defined in these Terms have a corresponding meaning;
          </p>
          <p class="ml-15">
            (d) an expression importing a natural person includes a company,
            partnership, joint venture, association, corporation or other body
            corporate and a government agency;
          </p>
          <p class="ml-15">
            (e) a reference to "includes" means to include without limitation;
          </p>
          <p class="ml-15">
            (f) a reference to a law is a reference to such law as amended,
            consolidated or replaced;
          </p>
          <p class="ml-15">
            (g) a reference to a document includes all amendments or supplements
            to such document, or replacements or innovations of it;
          </p>
          <p class="ml-15">
            (h) a reference to an entity in these Terms includes that entity's
            successors and permitted assigns;
          </p>
          <p class="ml-15">
            (i) all references to currencies or Virtual Assets shall include any
            successor currency or Virtual Asset, as the case may be; and
          </p>
          <p class="ml-15">
            (j) all references to dates are to dates of the Gregorian calendar.
          </p>
          <br />
          <p>
            No rule of construction applies to the disadvantage of a party
            because that party was responsible for the preparation of, or seeks
            to rely on, this document or any part of it.
          </p>
          <br />
          <p>
            The titles, subtitles and headings used herein are provided for
            convenience only and should not be considered in construing or
            interpreting the Terms.
          </p>
          <br />
          <p>
            These Terms and related documents may be translated. Any translation
            is for reference purposes only and is not certified by any person.
            Only the English language version of the Terms and its related
            documents have legal effect and shall prevail to the extent of any
            inconsistency.
          </p>
          <br />
          <h2>2. SERVICES</h2>
          <h3>2.1. Non-Custodial Wallet</h3>
          <br />
          <p>
            The Platform contains a user interface for interacting directly with
            the blockchain, third-party software applications, and third-party
            decentralized protocol. Subject to these Terms, Users may use the
            Platform to create and operate a Non-Custodial Wallet. When using
            the Non-Custodial Wallet created by the User through the Platform,
            Citadel.one does not receive, transfer or hold Virtual Assets on
            behalf of Users and does not directly or indirectly facilitate the
            clearance or settlement of any transactions made through the
            Non-Custodial Wallet.
          </p>
          <br />
          <p>
            Users should ensure the private keys and seed phrases relating to
            the Non-Custodial Wallet are stored securely. Citadel.one shall not
            be liable for any loss or theft related to the Virtual Assets
            received, held or otherwise transferred through the User's
            Non-Custodial Wallet, regardless of the reason for such loss or
            theft.
          </p>
          <br />
          <h3>2.2. Validator Services</h3>
          <br />
          <p>
            2.2.1. Subject to these Terms and the specific Supported Network
            Protocol, Users may use the Platform to Stake Virtual Assets to
            receive Net Rewards and exercise Voting Rights in a specific
            Supported Network, in accordance with the Supported Network
            Protocol.
          </p>
          <br />
          <p>
            2.2.2. The timing and rate of Rewards is programmed in Supported
            Network Protocol. Citadel.one does not own and has no control or
            discretion over the Supported Network Protocol, and therefore, has
            no control over the rate of Rewards that may be received through the
            Validator Services in a Supported Network. Furthermore, Supported
            Network Protocols may impose Penalties to Citadel.one which may
            include the inability to receive Rewards, and/or to exercise Voting
            Rights at any time. The User agrees and understands that Citadel.one
            does not guarantee that the Users will receive Net Rewards, and/or
            the the specific amount of Net Rewards and/or that Users will be
            able to exercise their Voting Rights associated to the Virtual
            Assets of a Specific Network, through the Validator Services,. The
            User acknowledges, agrees and understands that Citadel.one shall not
            be held responsible for delivering a specific rate of Rewards to
            Users, and shall not be held responsible for losses, liabilities,
            damages, reductions in value of the Delegated Virtual Assets or the
            Rewards.
          </p>
          <br />
          <p>
            2.2.3. Users may withdraw Virtual Assets from the Validator
            Services. However, Virtual Assets withdrawn by User may be subject
            to unbonding periods and other restrictions established by the
            relevant Supported Network Protocol. Therefore, Delegated Virtual
            Assets and Net Rewards may not be available to Users during such
            unbonding periods. Therefore, Citadel.one shall not be responsible
            for any losses, liabilities, damages, reductions in value or the
            inability to withdraw Delegated Virtual Assets or Net Rewards
            incurred by User in connection with the events described in this
            Section.
          </p>
          <br />
          <p>
            2.2.4. The Parties acknowledge that, subject to the Supported
            Network Protocol, the performance of the Validator Services will
            result in the transfer of Net Rewards by the Supported Network as
            follows:
          </p>
          <p class="ml-15">
            a) to User by transferring Net Rewards to the wallet address from
            which User Delegated the Virtual Assets to Citadel.one in accordance
            with these Terms;
          </p>
          <p class="ml-15">
            b) to Citadel.one as a Service Fee in accordance with the schedule
            of fees of Citadel.one for the Validator Services in the relevant
            Supported Network;
          </p>
          <p class="ml-15">
            c) the Net Rewards may be of the same denomination as the Virtual
            Assets that User has Delegated to Citadel.one in accordance with
            these Terms.
          </p>
          <br />
          <p>
            2.2.5. User acknowledges that the transfer of Net Rewards by the
            Supported Network is not guaranteed, User may not receive the
            Rewards, and that Citadel.one is in no way responsible for any
            failure by the Supported Network to transfer Net Rewards to User or
            the loss, destruction or transfer of Net Rewards to the incorrect
            User’s Virtual Asset wallet address.
          </p>
          <br />
          <p>
            2.2.6. The Parties acknowledge and agree that the Supported Network
            protocols may change, and airdrops or forks may arise, in each case
            outside of the control of Citadel.one, and therefore:
          </p>
          <p class="ml-15">
            a) Citadel.one may respond to protocol changes, airdrops or forks in
            any way that Citadel.one deems appropriate in its sole discretion,
            acting reasonably;
          </p>
          <p class="ml-15">
            b) the exercise by Citadel.one of any rights or powers available to
            it as a the owner and operator of a Node on the Supported Network
            does not constitute a breach or violation of any obligations of
            Citadel.one to User in accordance with these Terms;and
          </p>
          <p class="ml-15">
            c) Citadel.one is not responsible for any losses, liabilities,
            damages, or reductions in value in respect of the Virtual Assets or
            otherwise suffered by User in connection with protocol changes,
            airdrops or forks.
          </p>
          <br />
          <p>
            2.2.7. The User is responsible for maintaining the security of their
            Virtual Asset Wallets, private keys and accounts at all times.
            Citadel.one will never ask for private keys in any circumstance,
            will not hold such private keys and will not act as a custodian of
            the User’s Virtual Assets.
          </p>
          <br />
          <h3>2.3. Access to and Integration of Third-Party Applications</h3>
          <br />
          <p>
            The Platform contains a user interface that connects Users to, and
            allows Users to access, third-party software applications developed
            and operated by persons that are not affiliated or otherwise related
            to Citadel.one (<span class="bold"
              >“Third-Party Software Applications”</span
            >), including but not limited to software applications for buying,
            selling and trading Virtual Assets, staking Virtual Assets to
            receive rewards, and/or voting in decentralized autonomous
            organizations.
          </p>
          <br />
          <p>
            Citadel.one does not provide, develop, own, operate and has no
            control over the Third-Party Software Applications and therefore,
            Citadel.one has no control over the transactions conducted through
            such Third-Party Software Applications. The use of Third-Party
            Software Applications may be subject to the terms and conditions
            imposed by the persons operating such Third-Party Software
            Applications. The User acknowledges and agrees that Citadel.one
            shall not be responsible for the availability and/or performance of
            such Third-Party Applications and shall not be responsible or liable
            for any disputes, losses, liabilities, damages or other consequences
            arising from the use of Third-Party Applications.
          </p>
          <br />
          <h3>2.4. Transaction Reports</h3>
          <br />
          <p>
            The Platform allows Users to export reports and data related to
            their transactions and interaction with the blockchain using the
            interfaces available in the Platform (“Transaction Reports”).
            Citadel.one does not make any representation and/or warranty with
            respect to the accuracy of the data shown in such reports. The User
            acknowledges, understands and agrees that Transaction Report shall
            not be treated as a valuation of their Virtual Asset Wallers or
            Transactions, and the Transaction Reports should not be relied on.
            Citadel.one uses commercially reasonable efforts to ensure that the
            information contained in the Transaction Reports and that they are
            accurate and reliable; however, errors may occur from time to time.
            It is the User’s sole responsibility to review his or her
            Transaction Reports, and verify the accuracy of such Transaction
            Reports. The User acknowledges, understands and agrees that
            Citadel.one shall not be held liable as a result of inaccurate or
            incomplete data shown in the Transactions Reports, and/or arising
            from the reliance on such Transaction Reports.
          </p>
          <br />
          <h2>3. NO REPRESENTATIONS AND WARRANTIES; DISCLAIMER</h2>
          <br />
          <p>
            Your access or use of the Services is at your sole risk, and you are
            solely responsible for any losses, damages or costs resulting from
            using or accessing the Services. The Services do not constitute
            investment advice or any marketing, or promotion or offer of any
            product or investment to you or any third party. The Services are
            provided on an “AS IS” and “AS AVAILABLE” basis. The Services are
            provided without warranties of any kind, whether express or implied,
            including, but not limited to, implied warranties of
            merchantability, fitness for a particular purpose, non-infringement
            or course of performance. Citadel.one shall in no event be held
            liable for any loss or other damages, including but not limited to
            special, incidental, consequential, or other damages. Without
            limiting the foregoing, Citadel.one does not represent or warrant
            that the Services are accurate, complete, reliable, current or
            error-free, or free of viruses or other harmful components. By
            accessing and/or using our Services, you agree that Citadel.one
            shall not have any liability, contingent or otherwise, to you or to
            any third parties, for the correctness, quality, accuracy, security,
            completeness, reliability, performance, timeliness, pricing or
            continued availability of the Services or for delays or omissions of
            the Services, or for the failure of any connection or communication
            service to provide or maintain your access to the Services, or for
            any interruption in or disruption of your access or any erroneous
            communications between Citadel.one and you, regardless of cause.
          </p>
          <br />
          <p>
            CITADEL.ONE MAKES NO REPRESENTATION OR WARRANTY THAT THE SERVICES
            ARE APPROPRIATE FOR USE IN ALL LOCATIONS, OR THAT THE TRANSACTIONS
            AND SERVICES DESCRIBED HEREIN ARE AVAILABLE OR APPROPRIATE FOR ENTRY
            INTO OR USE IN ALL JURISDICTIONS OR BY ALL PARTIES. YOU SHOULD
            INFORM YOURSELF AS TO THE LEGAL REQUIREMENTS AND TAX CONSEQUENCES OF
            USING THE SERVICES WITHIN ALL JURISDICTIONS APPLICABLE TO YOU.
            CITADEL.ONE IS NOT RESPONSIBLE FOR TAX CONSEQUENCES TO YOU OF USING
            THE SERVICES.
          </p>
          <br />
          <p>
            Users shall be responsible for payment of all taxes, fees and
            surcharges, however designated, imposed on or based upon the use of
            the Services and Rewards or Net Rewards obtained by the use of
            Services.
          </p>
          <br />
          <p>
            Neither Citadel.one nor any of its Affiliated Entities shall provide
            any advice or guidance with respect to the tax obligations of the
            User. You are strongly encouraged to seek advice from your own tax
            advisor to discuss the potential tax consequences of entering into
            these Terms and the receipt of any Rewards.
          </p>
          <br />
          <p>
            Further, the Citadel.one Parties hereby expressly disclaims
            responsibility for, and shall in no case be liable for any damage,
            loss, penalty, cost or expense, whether direct, indirect,
            incidental, consequential, special, punitive, exemplary or economic
            (and whether or not caused by negligence) which arises in tort,
            contract or otherwise, to the fullest extent allowed by applicable
            law, to any person or entity in connection with:
          </p>
          <br />
          <p class="ml-15">
            (a) any person's use of the Services in violation of any anti-money
            laundering, counter-terrorism financing or other regulatory
            requirements that are imposed in any jurisdiction;
          </p>
          <p class="ml-15">
            (b) any person's use of the Services in violation of or
            contravention to any representation, warranty, obligation, covenant
            or other provision of these Terms
          </p>
          <p class="ml-15">
            (c) the exercise of any right by Citadel.one under these Terms;
          </p>
          <p class="ml-15">
            (d) unauthorized data interception, interruption, transmission
            blackout, or delays (due to data volume, server error or otherwise)
            during the provision of the Services;
          </p>
          <p class="ml-15">
            (e) a delay in development of the Platform, a failure to meet any
            anticipated milestones for the the Platform, or a failure to timely
            disclose any information relating to the development of the
            Platform;
          </p>
          <p class="ml-15">
            (f) any error, bug, flaw, defect or otherwise of the source code of
            the Platform or in related code;
          </p>
          <p class="ml-15">
            (g) any malfunction, breakdown, collapse, or delay caused by the
            blockchain or by software of the Website, Platform or Services;
          </p>
          <p class="ml-15">
            (h) any loss of Virtual Assets due a failure to (a) safeguard a
            Virtual Asset wallet, including the loss, destruction, theft or
            accidental disclosure of the private keys, or (b) not utilizing
            proper type or kind of Virtual Asset wallet;
          </p>
          <p class="ml-15">
            (i) any default, breach, infringement, breakdown, collapse, service
            suspension or interruption, fraud, mishandling, misconduct,
            malpractice, negligence, bankruptcy, insolvency, dissolution or
            winding-up of any developer, or operator of a Third-Party Software
            Application;
          </p>
          <p class="ml-15">
            (j) the Services being classified or treated by any government,
            quasi-government, authority or public body as a regulated activity.
          </p>
          <br />
          <h2>
            4. SECURITY OF YOUR VIRTUAL ASSET WALLET, INCLUDING THE
            NON-CUSTODIAL WALLET
          </h2>
          <br />
          <p>
            You are exclusively responsible for maintaining the confidentiality
            and security of your Virtual Asset wallet, including the
            Non-Custodial Wallet offered by Citadel.one, or devices you use to
            access the Services, and for ensuring that no unauthorized person
            has access to your Virtual Asset Wallet,including the Non-Custodial
            Wallet offered by Citadel.one, or devices you use to access the
            Services , or any device that you utilize in connection with the
            Services. Citadel.one shall not be liable for any loss or damage
            arising from your failure to protect your Non-Custodial Wallet,
            other Virtual Asset Wallets, or devices used to access the Services.
          </p>
          <br />
          <h2>5. OTHER TERMS AND CONDITIONS</h2>
          <br />
          <p class="ml-15">
            a) Citadel.one reserves the right to require Users to complete the
            identification process in line with relevant Know Your Customer,
            Anti-money Laundering, and Combating the Financing of Terrorism
            regulations.
          </p>
          <p class="ml-15">
            b) By using the Services, a User shall be deemed as (1) having
            accepted all the terms and conditions contained in these Terms, and
            the Privacy Policy, and (2) having agreed to use the Services in
            accordance with the same.
          </p>
          <br />
          <h2>6. GENERAL USE, PROHIBITED USE AND TERMINATION</h2>
          <h3>6.1. Limited License.</h3>
          <br />
          <p>
            Citadel.one grants you a revocable, limited, non-exclusive,
            non-transferable, and non-sublicensable license to access and use
            the Services through your Internet compatible devices for your
            personal/internal purposes subject to these Terms, to access and use
            the Website and the Services solely for approved purposes as
            permitted by Citadel.one from time to time. You hereby agree that
            when you use the Services, Citadel.one does not transfer the
            Services or any Intellectual Property Rights to you.
          </p>
          <br />
          <h3>6.2. Accuracy of the Website, the Platform, and Related Media</h3>
          <br />
          <p>
            Although we intend to provide accurate and timely information, the
            Content may not always be entirely accurate, complete or current and
            may also include technical inaccuracies or typographical errors. In
            an effort to continue to provide you with as complete and accurate
            information as possible, information may be changed or updated from
            time to time without notice, including without limitation
            information regarding our terms, policies, products and services.
            Accordingly, you should verify all information before relying on it,
            and all decisions based on information contained on the Website, the
            Platform or otherwise drawn from the Content are your sole
            responsibility and we shall have no liability for such decisions.
            Links to unaffiliated third-party materials (including without
            limitation websites and unaffiliated third parties) may be provided
            as a convenience but are not controlled by us. You acknowledge and
            agree that we are not responsible for any aspect of the information,
            content, or services contained in any unaffiliated third-party
            materials or on any unaffiliated third party sites accessible or
            linked to the Website or the Services.
          </p>
          <br />
          <h3>6.3. Third-Party Access</h3>
          <br />
          <p>
            If you grant express permission to a third party to access to your
            account of the Platform and/or Non-Custodial Wallet, you acknowledge
            that granting permission to an third party to take specific actions
            on your behalf does not relieve you of any of your responsibilities
            under the Terms. You are fully responsible for all acts or omissions
            of any third party with access to your account and/or Non-Custodial
            Wallet. Further, you acknowledge and agree that you will not hold
            Citadel.one responsible for, and will indemnify Citadel.one from,
            any liability arising out of or related to any act or omission of
            any third party with access to your account and/or Non-Custodial
            wallet.
          </p>
          <br />
          <h3>6.4. Prohibited Use</h3>
          <br />
          <p>
            In connection with your use of the Services, and your interactions
            with other users, and any third parties, you agree and represent you
            will not engage in any Prohibited Activities. We reserve the right
            at all times to monitor, review, retain and/or disclose any
            information as necessary to satisfy any applicable law, regulation,
            sanctions programs, legal process or governmental request. We
            reserve the right to cancel and/or suspend your Account if we
            determine, in our sole discretion, that your use of the Services is
            associated with a Prohibited Activity.
          </p>
          <br />
          <p>A “Prohibited Activity” includes but is not limited to:</p>
          <br />
          <p class="ml-15">
            a) use the Services for resale or commercial purposes, including
            transactions on behalf of other persons or entities;
          </p>
          <p class="ml-15">
            b) violate or assist any party in violating any law, statute,
            ordinance, regulation or any rule of any self-regulatory or similar
            organization of which you are or are required to be a member through
            your access and/or use of the Services;
          </p>
          <p class="ml-15">
            c) engage in any money laundering, terrorism financing or fraudulent
            activity;
          </p>
          <p class="ml-15">
            d) infringe upon our Intellectual Property Rights or any third
            party’s copyright, patent, trademark, or other intellectual property
            rights;
          </p>
          <p class="ml-15">
            e) take any action that imposes an unreasonable or
            disproportionately large load on our infrastructure, or
            detrimentally interfere with, intercept, or expropriate any system,
            data or information;
          </p>
          <p class="ml-15">
            f) transmit or upload any material to the Website, or the Platform,
            that contains viruses, Trojan horses, worms, or any other harmful or
            deleterious programs;
          </p>
          <p class="ml-15">
            g) attempt to gain unauthorized access to or use of the Website, the
            Platform, the APIs, other User accounts, or computer systems
            connected to the Services;
          </p>
          <p class="ml-15">
            h) use any deep linking, web crawlers, bots, spiders or other
            automatic devices, programs, scripts, algorithms or methods, or any
            similar or equivalent manual processes to access, obtain, copy or
            monitor any part of the properties, or replicate or bypass the
            navigational structure or presentation of the Website, the Platform
            or the Services;
          </p>
          <p class="ml-15">
            i) probe, scan or test the vulnerabilities of the Website, the
            Platform or the Services or any network connected to the properties,
            or violate any security or authentication measures on the Website,
            the Platform or the Services;
          </p>
          <p class="ml-15">
            j) provide false, inaccurate, incomplete or misleading information;
          </p>
          <p class="ml-15">
            k) distribute unsolicited or unauthorized advertising or promotional
            material, written media releases, public announcements and public
            disclosures, junk mail, spam or chain letters;
          </p>
          <p class="ml-15">
            l) use a web crawler or similar technique to access our Services or
            to extract data;
          </p>
          <p class="ml-15">
            m) reverse engineer or disassemble any aspect of the Website, APIs,
            the Platform or the Services in an effort to access any source code,
            underlying ideas and concepts and algorithms;
          </p>
          <p class="ml-15">
            n) perform any unauthorized vulnerability, penetration or similar
            testing on the API;
          </p>
          <p class="ml-15">
            o) attempt to gain unauthorized access to or use of the Website,
            other User accounts, computer systems, or networks connected to the
            Website, through password mining or any other means;
          </p>
          <p class="ml-15">
            p) transfer any rights granted to you under these Terms; or
          </p>
          <p class="ml-15">
            q) engage in any behavior which violates the Terms or is otherwise
            deemed unacceptable by us in our sole discretion.
          </p>
          <br />
          <h3>6.5.Termination, and Cancellation</h3>
          <br />
          <p>
            a) We may suspend, restrict, or terminate your access to any or all
            of the Services, and/or deactivate or cancel your use of the
            Services if (i) we are so required by a facially valid subpoena,
            court order, or binding order of a government authority; (ii) we
            reasonably suspect you of using the Services in connection with a
            Prohibited Activity; (iii) use of the Services is subject to any
            pending litigation, investigation, or government proceeding and/or
            we perceive a heightened risk of legal or regulatory non-compliance
            associated with your use of the Services; (iv) you take any action
            that Citadel.one deems as breaching the Terms.
          </p>
          <br />
          <p>
            b) If Citadel.one suspends, freezes, restricts or terminates your
            access and/or use of the Services for any reason, we may provide you
            with notice of our actions unless a court order or other legal
            process prohibits Citadel.one from providing you with such notice.
            You acknowledge that Citadel.one’s decision to take certain actions,
            including limiting or restricting access to the Services, may be
            based on confidential criteria that are essential to our risk
            management and security protocols. You agree that Citadel.one is
            under no obligation to disclose the details of its risk management
            and security procedures to you.
          </p>
          <br />
          <p>
            c) You acknowledge, understand and agree that Citadel.one has the
            right to investigate any violation of these Terms, unilaterally
            determine whether you have violated these Terms, and take actions
            under relevant laws and regulations without your consent or prior
            notice.
          </p>
          <br />
          <h3>6.6. Relationship of the Parties</h3>
          <br />
          <p>
            Nothing in these Terms shall be deemed or is intended to be deemed,
            nor shall it cause you and Citadel.one to be treated as partners,
            joint ventures, or otherwise as joint associates for profit, or
            either you or Citadel.one to be treated as the agent of the other.
          </p>
          <br />
          <h2>7. INTELLECTUAL PROPERTY</h2>
          <h3>7.1. All rights reserved</h3>
          <br />
          <p>
            All Intellectual Property Rights relating to the Website, the
            Platform, the Content, the User Content, and the Services are the
            property of Citadel.one. You acknowledge that all Intellectual
            Property Rights of Citadel.one in the Website, the Platform, the
            Content, the User Content, and the Services shall remain the
            property of Citadel.one.
          </p>
          <br />
          <h3>7.2. No right to use</h3>
          <br />
          <p>
            You are not granted any right to use, and may not use, any of
            Intellectual Property Rights of Citadel.one other than as set out in
            these Terms and subject to the following:
          </p>
          <br />
          <p class="ml-15">
            a) you may only view and use the Services, the Website, the
            Platform, the Content or the User Content for your own personal use
            and may not copy, reproduce, republish, upload, repost, modify,
            transmit, distribute or otherwise use the use the Services, the
            Website, the Platform, the Content or the User Content in any way
            for non-personal, public or commercial use without the prior written
            consent of Citadel.one;
          </p>
          <p class="ml-15">
            b) you may not remove or modify any copyright, trademark or other
            proprietary notices that have been placed in any part of the
            Website, the Platform, the Content, the User Content, and the
            Services;
          </p>
          <p class="ml-15">
            c) you may not modify, publish, transmit, participate in the
            transfer or sale of, create derivative works from, or in any way
            exploit, any of the Content or the User Content;
          </p>
          <p class="ml-15">
            d) except as otherwise expressly permitted under copyright law, no
            copying, redistribution, retransmission, publication or commercial
            exploitation of downloaded material will be permitted without our
            express permission;
          </p>
          <p class="ml-15">
            e) in the event of any permitted copying, redistribution or
            publication of copyright material, no changes in or deletion of
            author attribution, trademark legend or copyright notice shall be
            made; and
          </p>
          <p class="ml-15">
            f) you may not use any data mining, robots or similar data-gathering
            or extraction methods.
          </p>
          <br />
          <h3>7.3. User Content</h3>
          <br />
          <p>
            By submitting any User Content you warrant that you are entitled to,
            and have all necessary Intellectual Property Rights of the User
            Content submitted. We reserve the right to disclose your identity to
            any third party who claims that any of your User Content constitutes
            a violation of their Intellectual Property Rights or of their right
            to privacy. You hereby transfer all rights, ownership and interests
            of your User Content and all related intellectual property rights to
            Citadel.one. You have no right and hereby waive any request for
            acknowledgment or compensation based on any User Content, or any
            modifications based on any User Content.
          </p>
          <br />
          <h2>8. FEES AND XCT REWARDS</h2>
          <h3>8.1. Service Fees</h3>
          <br />
          <p>
            Service Fees and commissions arising out of Citadel.one providing
            Services are set forth at citadel.one, you agree to pay all
            applicable non-refundable fees. We may, at our discretion, update
            the fees at any time.
          </p>
          <br />
          <h3>8.2. XCT Rewards</h3>
          <br />
          <p>
            Citadel.one may reward Users’ use of the Services with an amount of
            XCT Tokens (“XCT Rewards”). Such rewards in XCT Tokens are at the
            sole discretion of Citadel.one. Users shall have no right to claim
            XCT Rewards, or a specific amount of XCT Rewards, and Citadel.one
            shall have no liability or responsibility arising from failure of
            distributing XCT Rewards, or for distributing amounts of XCT Rewards
            which are not in line with Users’ expectations.
          </p>
          <br />
          <h2>9. REPRESENTATIONS, WARRANTIES AND COVENANTS OF THE USER</h2>
          <br />
          <p>
            By accessing and/or using the Website, the Platform and/or the
            Services, you represent and warrant that:
          </p>
          <br />
          <p class="ml-15">
            a) you are at least 18 years old or of legal age to form a binding
            contract under applicable law, are an individual, legal person or
            other organization with full legal capacity and authority to enter
            into these Terms;
          </p>
          <p class="ml-15">
            b) if you are entering into these Terms on behalf of a legal entity
            of which you are an employee or agent, you have all necessary rights
            and authority to bind such legal entity, and (i) you are legally
            permitted to use the Services in your jurisdiction, and (ii) you are
            legally permitted to own cryptocurrencies in your jurisdiction;
          </p>
          <p class="ml-15">
            c) you are responsible for ensuring compliance with the laws of your
            jurisdiction and acknowledge that Citadel.one is not liable for your
            compliance with such laws;
          </p>
          <p class="ml-15">
            d) your use of the Services does not constitute a breach of the laws
            of your jurisdiction;
          </p>
          <p class="ml-15">
            e) you understand the inherent risks associated with Virtual Assets;
          </p>
          <p class="ml-15">
            f) you have a working understanding of the usage of Virtual Assets,
            smart contract based tokens, and blockchain-based software system;
          </p>
          <p class="ml-15">
            g) you have an understanding and experience in staking, accounts,
            keys, and details of the relevant Supported Networks and Supported
            Network Protocols;
          </p>
          <p class="ml-15">
            h) you have conducted an investigation of the Supported Network and
            understand the rules of the relevant Supported Network Protocol, and
            other matters considered in these Terms in order to determine
            whether to use the Services
          </p>
          <p class="ml-15">
            i) you will not carry out any activity that (i) involves proceeds
            from any illegal or unlawful activity (including money laundering or
            terrorism financing); or (ii) violates, or could violate, any
            applicable law;
          </p>
          <p class="ml-15">
            j) you will not use, or misuse, the Services, the Website or the
            Platform in any way which may impair the functionality of the
            Services, or other systems used to deliver the Services or impair
            the ability of any other user to use the Services or Website or
            Platform;
          </p>
          <p class="ml-15">
            k) you will not transmit or input into the Platform any files that
            may damage any other person’s computing devices or software; content
            that may be offensive; or material or data in violation of any law;
          </p>
          <p class="ml-15">
            l) you are the legal owner (or an authorized agent of the legal
            owner) of the Virtual Assets you use in connection with the
            Services, and that these funds are derived from a legitimate source;
          </p>
          <p class="ml-15">
            m) you will not use any method or services to mask your internet
            protocol address or your internet traffic or current location or
            real internet connection, including but not limited to virtual
            private networks, proxy servers, Tor browser;
          </p>
          <p class="ml-15">
            n) you are not a national and/or resident of a Prohibited
            Jurisdiction;
          </p>
          <p class="ml-15">
            o) you are not by reason of your nationality, domicile, citizenship,
            residence or otherwise subject to the laws of a Prohibited
            Jurisdiction;
          </p>
          <p class="ml-15">p) you are not a US Person; and</p>
          <p class="ml-15">
            q) you are are not, and have not been involved in a transaction with
            a person who is, on any trade or economic sanctions lists,
            including, but not limited to, the UN Security Council Sanctions
            list, designated as a “Specially Designated National” by OFAC
            (Office of Foreign Assets Control of the U.S. Treasury Department)
            or placed on the U.S. Commerce Department’s “Denied Persons List”.
            Citadel.one maintains the right to restrict or deny the provision of
            Services in certain countries and/or to certain natural persons
            and/or juristic persons at its sole discretion.
          </p>
          <br />
          <h2>
            10. ANTI-MONEY LAUNDERING, ECONOMIC SANCTIONS, ANTI-BRIBERY AND
            ANTI-BOYCOTT REPRESENTATIONS
          </h2>
          <br />
          <p class="ml-15">
            (a) Neither the User, nor any of its affiliates or direct or
            indirect beneficial owners, (i) appears on the Specially Designated
            Nationals and Blocked Persons List of the Office of Foreign Assets
            Control of the United States Department of the Treasury (“OFAC”) or
            any other sanctions or embargoes list from any jurisdiction, nor are
            they otherwise a party with which Citadel.one Parties are prohibited
            to deal under the law, (ii) is a person identified as a terrorist
            organization on any other relevant lists maintained by governmental
            authorities, or (iii) unless otherwise disclosed in writing to
            Citadel.one prior to the User’s use of the Services, is a senior
            foreign political figure,(2) or any immediate family member(3) or
            close associate(4) of a senior foreign political figure as those
            terms are defined in the footnotes below.
          </p>
          <br />
          <p class="ml-15">
            (b) The User represents, warrants and agrees that no payment or
            other transfer of value to Citadel.one and no payment or other
            transfer of value to the User shall cause the Citadel.one Parties to
            be in violation of applicable laws or regulations, including,
            without limitation, anti-money laundering, economic sanctions,
            anti-bribery or anti-boycott laws or regulations of any
            jurisdiction.
          </p>
          <br />
          <p class="ml-15">
            (c) The User represents, warrants and agrees that no payment or
            other transfer of value to Citadel.one is or will be derived from a
            Prohibited Jurisdiction.
          </p>
          <br />
          <p class="ml-15">
            (d) The User represents, warrants and agrees that all payments or
            other transfer of value to Citadel.one by the User will be made
            through an account (or virtual currency public address whose
            associated balance, either directly or indirectly, has been funded
            by such an account) located in a jurisdiction that is not subject to
            international sanctions or embargoes.
          </p>
          <br />
          <h2>11. CITADEL.ONE’S RIGHTS</h2>
          <br />
          <p class="ml-15">
            (a) Citadel.one reserves the right to revise and amend these Terms
            at its absolute discretion at any point of time, and such revision
            or amendment shall be binding for all Users without exception;
          </p>
          <br />
          <p class="ml-15">
            (b) Citadel.one reserves the right to reject any User at its
            absolute discretion at any point for the provision of Services;
          </p>
          <br />
          <p class="ml-15">
            (c) Citadel.one reserves the right to waive or not enforce one or
            more provisions of these Terms as to any User;
          </p>
          <br />
          <p class="ml-15">
            (d) Citadel.one reserves the right to provide services at different
            Services Fees, and other terms and conditions, as it may determine
            in its absolute discretion.
          </p>
          <br />
          <h2>12. INDEMNIFICATION</h2>
          <br />
          <p>
            To the fullest extent permitted by Applicable Law, you agree to
            indemnify, defend and hold harmless Citadel.one, the Affiliated
            Entities and the Citadel.one Parties from and against all claims,
            demands, actions, damages, losses, costs and expenses (including
            attorneys' fees) that arise from or relate to: (1) your
            responsibilities or obligations under these Terms, or (2) your
            violation of any of the provisions in these Terms.
          </p>
          <br />
          <p>
            The Citadel.one Parties reserve the right to exercise sole control
            over the defense, at your expense, of any claim subject to
            indemnification under this section.
          </p>
          <br />
          <h2>13. LIMITATION OF LIABILITY; RELEASE</h2>
          <br />
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            CITADEL.ONE OR ANY OF THE OTHER CITADEL.ONE PARTIES BE LIABLE FOR
            ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY OR
            PUNITIVE DAMAGES OF ANY KIND OR FOR LOSS OF REVENUE, INCOME OR
            PROFITS, LOSS OF USE OR DATA, LOSS OR DIMINUTION IN VALUE OF ASSETS,
            OR DAMAGES FOR BUSINESS INTERRUPTION ARISING OUT OF OR IN ANY WAY
            RELATED TO THE ACCESS OR USE OF THE SERVICES, PLATFORM OR WEBSITE OR
            OTHERWISE RELATED TO THESE TERMS (INCLUDING, BUT NOT LIMITED TO, ANY
            DAMAGES CAUSED BY OR RESULTING FROM RELIANCE BY ANY USER ON ANY
            INFORMATION HEREIN, OR FROM MISTAKES, OMISSIONS, INTERRUPTIONS,
            DELETIONS OF FILES OR EMAILS, ERRORS, DEFECTS, BUGS, VIRUSES, TROJAN
            HORSES, DELAYS IN OPERATION OR TRANSMISSION OR ANY FAILURE OF
            PERFORMANCE, WHETHER OR NOT RESULTING FROM ACTS OF GOD,
            COMMUNICATIONS FAILURE, THEFT, DESTRUCTION OR UNAUTHORIZED ACCESS TO
            RECORDS, PROGRAMS OR SYSTEMS), REGARDLESS OF THE FORM OF ACTION,
            WHETHER BASED IN CONTRACT, TORT (INCLUDING, BUT NOT LIMITED TO,
            SIMPLE NEGLIGENCE, WHETHER ACTIVE, PASSIVE OR IMPUTED), OR ANY OTHER
            LEGAL OR EQUITABLE THEORY (EVEN IF THE PARTY HAS BEEN ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF WHETHER SUCH DAMAGES
            WERE FORESEEABLE).
          </p>
          <br />
          <p>
            EACH USER AGREES THAT THEY WILL NOT COMMENCE, OR ATTEMPT OR THREATEN
            TO COMMENCE, ANY PROCEEDINGS, ACTION OR CLAIM (INCLUDING ANY CLAIM
            FOR COMPENSATION OR COSTS) AGAINST CITADEL.ONE OR ANY OF THE
            CITADEL.ONE PARTIES IN ANY JURISDICTION FOR THE RECOVERY OF ANY
            LOSS, DAMAGE, COST OR EXPENSE, OR IN RELATION TO ANY LIABILITY,
            ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE SERVICES, THE
            WEBSITE OR THE PLATFORM.
          </p>
          <br />
          <h2>14. NO WAIVER</h2>
          <br />
          <p>
            From time to time, Citadel.one may fail to require or strictly
            enforce compliance with relation to any provision in these Terms.
            Citadel.one may also fail to exercise any or all of its rights
            empowered herein. Any such failure shall not be construed as a
            waiver or relinquishment of Citadel.one's right to assert or rely
            upon any such provision or right in that or in any other instance.
            If applicable, an express waiver given by Citadel.one of any
            condition, provision, or requirement of these Terms shall not
            constitute a waiver of any future obligation to comply with such
            condition, provision or requirement.
          </p>
          <br />
          <h2>15. SEVERABILITY</h2>
          <br />
          <p>
            If any portion of these Terms is held to be illegal, unenforceable
            or invalid, whether in whole or part, under the laws of any
            jurisdiction, that portion shall be severed, and such illegality,
            unenforceability or invalidity shall not affect the legality,
            enforceability or validity of the rest of these Terms in that
            jurisdiction, nor the legality, enforceability or validity of these
            Terms in any other jurisdiction.
          </p>
          <br />
          <h2>16. GOVERNING LAW AND JURISDICTION</h2>
          <br />
          <p>
            These Terms are governed by the laws of the British Virgin Islands.
            Any present or future law which operates to vary the obligations of
            the Citadel.one Parties in connection with these Terms with the
            result that Citadel.one’s or Citadel.one Parties’ rights, powers or
            remedies are adversely affected (including by way of delay or
            postponement) is excluded except to the extent that its exclusion is
            prohibited or rendered ineffective by law.
          </p>
          <br />
          <p>
            You agree to submit any Dispute (as defined below) to arbitration in
            accordance with the terms of Section 17 below. To the extent that
            the agreement to arbitrate is ineffective or void, you agree to
            submit to the exclusive jurisdiction of the courts of the British
            Virgin Islands.
          </p>
          <br />
          <h2>17. SUBMISSION TO ARBITRATION</h2>
          <br />
          <p>
            Any dispute, claim, suit, action, cause of action, demand, or
            proceeding arising out of or related to these Terms and any terms
            announced on the Website (including with respect of their validity,
            existence, or termination), any action or transaction under or
            contemplated by these Terms, including the use of the Website,
            Platform, and/or Services, (any "Dispute") that is not settled by
            you and Citadel.one within 30 days from the date that either party
            notifies the other party in writing of the Dispute shall be referred
            to and finally settled by arbitration.
          </p>
          <br />
          <p>
            Notwithstanding any other provision of these Terms, you agree that
            Citadel.one has the right to apply for injunctive remedies (or an
            equivalent type of urgent legal relief) in any jurisdiction.
          </p>
          <br />
          <p>
            To the fullest extent permitted by law, you irrevocably and
            unconditionally waive, with respect to yourself and any of your
            revenues and assets (irrespective of their use or intended use), all
            immunity on the grounds of sovereignty or other similar grounds
            from: suit; jurisdiction of any court; relief by way of injunction
            or order for specific performance or recovery of property;
            attachment of assets (whether before or after judgment); and
            execution or enforcement of any judgment to which you or your
            revenues or assets might otherwise be entitled in any proceedings in
            the courts of any jurisdiction 17(and you irrevocably agree, to the
            fullest extent permitted by applicable law, that you will not claim
            any immunity in any such proceedings).
          </p>
          <br />
          <h2>18. WAIVER OF CLASS ACTION RIGHTS AND CLASS WIDE ARBITRATION</h2>
          <br />
          <p>
            You agree that any Dispute is personal to you and Citadel.one and
            will not be brought as a representative action, class action, or any
            other type of representative proceeding in which an individual
            attempts to resolve a Dispute as a representative of another
            individual or group of individuals. You agree not to join with any
            other individual or entity or group of individuals or entities for
            the purpose of seeking to resolve the respective Disputes on a
            consolidated or representative basis.
          </p>
          <br />
          <h2>19. FURTHER STEPS</h2>
          <br />
          <p>
            Each User agrees to do anything (such as obtaining consents, signing
            and producing documents, producing receipts and getting documents
            completed and signed), which Citadel.one asks and considers
            necessary to:
          </p>
          <br />
          <p class="ml-15">
            1. bind the User and any other person intended to be bound in
            connection with any provision in these Terms;
          </p>
          <p class="ml-15">
            2. confirm whether the User is complying with applicable law and
            these Terms;
          </p>
          <p class="ml-15">
            3. comply with its legal, regulatory and governance requirements.
          </p>
          <br />
          <h2>20. NO THIRD PARTY BENEFICIARIES</h2>
          <br />
          <p>
            These Terms are intended solely for the benefit of the parties and
            are not intended to confer third party beneficiary rights upon any
            other person or entity.
          </p>
          <h2>
            THE USER ACKNOWLEDGES HAVING RECEIVED, READ AND UNDERSTOOD THE
            FOREGOING TERMS AND HEREBY AGREES TO BE BOUND BY ALL OF THE TERMS
            AND CONDITIONS HEREOF.
          </h2>
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
      if (router.currentRoute.value.name === 'modalTerms') {
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

  .ml-15 {
    margin-left: 15px;
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
