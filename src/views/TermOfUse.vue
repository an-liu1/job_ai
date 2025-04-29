<template>
  <div class="terms-container">
    <el-card class="terms-card">
      <!-- Header Section -->
      <div class="terms-header">
        <h1 class="title">JobAce Terms of Service</h1>
        <p class="effective-date">Effective Date: {{ currentDate }}</p>
      </div>

      <!-- Welcome Section -->
      <div class="section welcome-section">
        <h2>Welcome to JobAce!</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of the
          JobAce website, applications, and services (collectively, the
          "Services"). By using our Services, you agree to these Terms.
        </p>
        <p class="important-note">Please read them carefully.</p>
      </div>

      <!-- Main Content Sections -->
      <div class="content-sections">
        <div
          v-for="(section, index) in termsSections"
          :key="index"
          class="content-section"
        >
          <h2>{{ section.id }}. {{ section.title }}</h2>
          <div v-html="section.content"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "TermsOfService",
  computed: {
    currentDate() {
      const today = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      return today.toLocaleDateString("en-US", options);
    },
    termsSections() {
      return [
        {
          id: 1,
          title: "Eligibility",
          content: `<p>You must be at least 16 years old to use JobAce. By accessing or using our Services, you represent and warrant that you meet this age requirement.</p>`,
        },
        {
          id: 2,
          title: "Your Account",
          content: `<p>To access certain features, you must create an account or sign in with a third-party provider (e.g., Google).</p>
          <p>You are responsible for maintaining the security of your account and for all activities that occur under your account.</p>`,
        },
        {
          id: 3,
          title: "Services Provided",
          content: `<p>JobAce provides an AI-powered interview practice platform that enables users to:</p>
          <ul>
            <li>Practice verbal responses to interview questions</li>
            <li>Receive real-time feedback on tone, pacing, structure, and language</li>
            <li>Access mock interviews and final assessment reports</li>
            <li>Track performance and growth over time</li>
          </ul>
          <p>We do not guarantee job placement or interview outcomes.</p>`,
        },
        {
          id: 4,
          title: "Payment and Subscriptions",
          content: `<p>Some features of JobAce require payment, either through:</p>
          <ul>
            <li>Pay-per-use credits (individual session purchases)</li>
            <li>Premium subscription (unlimited access during subscription term)</li>
          </ul>
          <p>All fees are non-refundable except where required by law.</p>
          <p>Subscription plans may renew automatically unless canceled before the end of the billing cycle.</p>`,
        },
        {
          id: 5,
          title: "Free Trial",
          content: `<p>JobAce may offer a 7-day free trial to new users. Trial access includes a limited number of practice sessions and mock interviews.</p>
          <p>After the trial, you must purchase credits or subscribe to continue full access.</p>`,
        },
        {
          id: 6,
          title: "Acceptable Use",
          content: `<p>When using JobAce, you agree to:</p>
          <ul>
            <li>Use the Services only for lawful purposes</li>
            <li>Not attempt to reverse engineer, disrupt, or exploit the platform</li>
            <li>Not share offensive, harmful, or misleading content</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>`,
        },
        {
          id: 7,
          title: "Content and Intellectual Property",
          content: `<p>All software, AI models, text, graphics, audio, and other content provided by JobAce are owned by JobAce or its licensors.</p>
          <p>You may not reproduce, distribute, or create derivative works without express permission.</p>`,
        },
        {
          id: 8,
          title: "User Data and Privacy",
          content: `<p>We collect and process your data in accordance with our Privacy Policy.</p>
          <p>By using our Services, you consent to this processing, including storing your practice recordings, transcripts, and progress history.</p>`,
        },
        {
          id: 9,
          title: "Service Modifications",
          content: `<p>We may change, suspend, or discontinue any part of the Services at any time.</p>
          <p>We are not liable for any modification, price change, suspension, or discontinuation of the Services.</p>`,
        },
        {
          id: 10,
          title: "Disclaimers",
          content: `<p>The Services are provided "as is" without warranties of any kind.</p>
          <p>We do not guarantee that using JobAce will result in securing a job or passing any interview.</p>`,
        },
        {
          id: 11,
          title: "Limitation of Liability",
          content: `<p>To the fullest extent permitted by law, JobAce and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Services.</p>`,
        },
        {
          id: 12,
          title: "Governing Law",
          content: `<p>These Terms are governed by and construed in accordance with the laws of [Insert jurisdiction, e.g., Province of Ontario, Canada], without regard to conflict of law principles.</p>`,
        },
        {
          id: 13,
          title: "Changes to These Terms",
          content: `<p>We may update these Terms from time to time.</p>
          <p>If changes are material, we will provide notice (such as via email or the platform). Your continued use of the Services after any update constitutes your acceptance of the new Terms.</p>`,
        },
        {
          id: 14,
          title: "Contact Us",
          content: `<p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: <a href="mailto:customerservice@jobace.ca">customerservice@jobace.ca</a></p>`,
        },
      ];
    },
  },
};
</script>

<style scoped>
.terms-container {
  padding: 100px 20px 20px 20px;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );
}

.terms-card {
  max-width: 1300px;
  margin: 0 auto;
  padding: 30px;
  margin-bottom: 30px;
}

.terms-header {
  text-align: center;
  margin-bottom: 30px;
}

.terms-header .title {
  color: #409eff;
  font-size: 28px;
  margin-bottom: 10px;
}

.effective-date {
  color: #909399;
  font-size: 14px;
}

.welcome-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.welcome-section h2 {
  color: #409eff;
  margin-bottom: 15px;
}

.important-note {
  font-weight: bold;
  color: #f56c6c;
}

.content-sections {
  margin-bottom: 20px;
}

.content-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.content-section:last-child {
  border-bottom: none;
}

.content-section h2 {
  color: #409eff;
  margin-bottom: 15px;
  font-size: 20px;
}

.content-section ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.content-section li {
  margin-bottom: 8px;
}

.content-section a {
  color: #409eff;
  text-decoration: none;
}

.content-section a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .terms-container {
    padding: 10px;
  }

  .terms-card {
    padding: 15px;
  }

  .terms-header .title {
    font-size: 24px;
  }

  .content-section h2 {
    font-size: 18px;
  }
}
</style>
