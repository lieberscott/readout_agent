import React from 'react';
import { useState } from 'react';

import { Container, Col, Row } from 'reactstrap';

import PollHeader from "./PollHeader";

import stylesheet from './myStyles.css';

const Home = (props) => {

  return (
    <Container style={{ backgroundColor: "white", margin: "30px auto" }}>
      <PollHeader />
      <div>
        <h1>PRIVACY POLICY</h1>
        <p className={ stylesheet.lastupdated }>Last updated January 25, 2020</p>
        <div className={ stylesheet.text }>
          <p>Thank you for choosing to be part of our community at Readout Consult, doing business as Readout (“Readout”, “we”, “us”, or “our”). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at our <a href="/contact">Contact</a> page.</p>
          <p>When you visit our website readoutconsult.com, and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important.
          If there are any terms in this privacy policy that you do not agree with, please discontinue use of our Sites and our services.</p>
          <p>This privacy policy applies to all information collected through our website (such as readoutconsult.com), and/or any related services, sales, marketing or events (we refer to them collectively in this privacy policy as the "Services").</p>
          <p style={{ fontWeight: "bold" }}>Please read this privacy policy carefully as it will help you make informed decisions about sharing your personal information with us.</p>
        </div>

        <h2>TABLE OF CONTENTS</h2>
        <div className={ stylesheet.text }>
          <p><a href="#ch1">1. WHAT INFORMATION DO WE COLLECT?</a></p>
          <p><a href="#ch2">2. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</a></p>
          <p><a href="#ch3">3. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></p>
          <p><a href="#ch4">4. DO WE USE GOOGLE MAPS?</a></p>
          <p><a href="#ch5">5. HOW LONG DO WE KEEP YOUR INFORMATION?</a></p>
          <p><a href="#ch6">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></p>
          <p><a href="#ch7">7. DO WE COLLECT INFORMATION FROM MINORS?</a></p>
          <p><a href="#ch8">8. WHAT ARE YOUR PRIVACY RIGHTS?</a></p>
          <p><a href="#ch9">9. CONTROLS FOR DO-NOT-TRACK FEATURES</a></p>
          <p><a href="#ch10">10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></p>
          <p><a href="#ch11">11. DO WE MAKE UPDATES TO THIS POLICY?</a></p>
          <p><a href="#ch12">12. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</a></p>
        </div>

        <h2 id="ch1">1. WHAT INFORMATION DO WE COLLECT?</h2>
        <h4>Personal information you disclose to us</h4>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span> We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.</p>
          <p>We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect can include the following:</p>
          <p><span style={{ fontWeight: "bold" }}>Publicly Available Personal Information.</span> We collect voter registration; and other similar data.</p>
          <p><span style={{ fontWeight: "bold" }}>Personal Information Provided by You.</span> We collect political and social affiliation to different groups; data collected from surveys; and other similar data.</p>
          <p><span style={{ fontWeight: "bold" }}>Credentials.</span> We collect passwords, password hints, and similar security information used for authentication and account access.</p>
          <p>All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.</p>
          <h4>Information automatically collected</h4>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span> Some information — such as IP address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
          <p>We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services and other technical information.
          This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
          <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
        </div>

        <h2 id="ch2">2. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          <p>We may process or share data based on the following legal basis:</p>
          <ul>
            <li><span style={{ fontWeight: "bold" }}>Consent:</span> We may process your data if you have given us specific consent to use your personal information in a specific purpose.</li>

            <li><span style={{ fontWeight: "bold" }}>Legitimate Interests:</span> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>

            <li><span style={{ fontWeight: "bold" }}>Performance of a Contract:</span> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>

            <li><span style={{ fontWeight: "bold" }}>Legal Obligations:</span> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).</li>

            <li><span style={{ fontWeight: "bold" }}>Vital Interests:</span> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
        </ul>
          <p>More specifically, we may need to process your data or share your personal information in the following situations:</p>

          <ul>
            <li><span style={{ fontWeight: "bold" }}>Vendors, Consultants and Other Third-Party Service Providers.</span> We may share your data with third party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service and marketing efforts.
            We may allow selected third parties to use tracking technology on the Services, which will enable them to collect data about how you interact with the Services over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity. Unless described in this Policy, we do not share, sell, rent or trade any of your information with third parties for their promotional purposes.</li>

            <li><span style={{ fontWeight: "bold" }}>Business Transfers.</span> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>

            <li><span style={{ fontWeight: "bold" }}>Third-Party Advertisers.</span> We may use third-party advertising companies to serve ads when you visit the Services. These companies may use information about your visits to our Website(s) and other websites that are contained in web cookies and other tracking technologies in order to provide advertisements about goods and services of interest to you.</li>

            <li><span style={{ fontWeight: "bold" }}>Business Partners.</span> We may share your information with our business partners.</li>

          </ul>
        </div>

        <h2 id="ch3">3. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  We may use cookies and other tracking technologies to collect and store your information.</p>
          <p>We do not use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.</p>
        </div>

        <h2 id="ch4">4. DO WE USE GOOGLE MAPS?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short: </span> Yes, we use Google Maps for the purpose of providing better service.</p>
          <p>This website, mobile application, or Facebook application uses Google Maps APIs. You may find the Google Maps APIs Terms of Service <a href="https://cloud.google.com/maps-platform/terms/">here</a>. To better understand Google’s Privacy Policy, please refer to this <a href="https://policies.google.com/privacy">link</a>.</p>
          <p>By using our Maps API Implementation, you agree to be bound by Google’s Terms of Service.</p>
        </div>

        <h2 id="ch5">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.</p>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than 2 years.</p>
          <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
        </div>

        <h2 id="ch6">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  We aim to protect your personal information through a system of organizational and technical security measures.</p>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the services within a secure environment.</p>
        </div>

        <h2 id="ch7">7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  We do not knowingly collect data from or market to children under 18 years of age.</p>
          <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.
          If you become aware of any data we have collected from children under age 18, please contact us <a href="/contact">here</a>.</p>
        </div>

        <h2 id="ch8">8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  You may review, change, or terminate your account at any time.</p>
          <p>If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: <a href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm</a>.</p>
        </div>

        <h2 id="ch9">9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically
          communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy policy.</p>
        </div>

        <h2 id="ch10">10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</p>
          <p>California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year.
          If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</p>
          <p>If you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services,
          but please be aware that the data may not be completely or comprehensively removed from our systems.</p>
        </div>

        <h2 id="ch11">11. DO WE MAKE UPDATES TO THIS POLICY?</h2>
        <div className={ stylesheet.text }>
          <p style={{ fontStyle: "italic" }}><span style={{ fontWeight: "bold" }}>In Short:</span>  Yes, we will update this policy as necessary to stay compliant with relevant laws.</p>
          <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy,
          we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.</p>
        </div>

        <h2 id="ch12">12. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</h2>
        <div className={ stylesheet.text }>
          <p>If you have questions or comments about this policy, you may contact us at our <a href="/contact">contact</a> page, or by post to:</p>
          <p>Readout Consult<br/>
          5923 N. Winthrop Ave. #3N<br/>
          Chicago, IL 60660<br/>
          United States</p>
        </div>

        <h2>HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
        <div className={ stylesheet.text }>
          <p>Based on the laws of some countries, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please submit a request form by clicking <a href="/contact">here</a>. We will respond to your request within 30 days.</p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
