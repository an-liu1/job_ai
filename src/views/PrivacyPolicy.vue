<template>
  <div class="privacy-container">
    <el-card class="privacy-card">
      <!-- Header Section -->
      <div class="privacy-header">
        <h1 class="title">JobAce Privacy Policy</h1>
        <p class="effective-date">Effective Date: {{ currentDate }}</p>
      </div>

      <!-- Introduction Section -->
      <div class="section introduction-section">
        <p>
          At JobAce, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, and protect your personal information
          when you use our platform.
        </p>
      </div>

      <!-- Main Content Sections -->
      <div class="content-sections">
        <div
          v-for="(section, index) in privacySections"
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
  name: "PrivacyPolicy",
  computed: {
    currentDate() {
      const today = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      return today.toLocaleDateString("en-US", options);
    },
    privacySections() {
      return [
        {
          id: 1,
          title: "Information We Collect",
          content: `<p>When you sign up and use our services, we may collect:</p>
          <h3>Account Information</h3>
          <p>Your name, email address, and login credentials (including third-party logins like Google)</p>
          
          <h3>Usage Data</h3>
          <p>Practice session recordings, AI-generated feedback, transcripts, and progress history</p>
          
          <h3>Technical Data</h3>
          <p>Device type, browser information, microphone access status, and session timestamps</p>
          
          <h3>Payment Information</h3>
          <p>Payments on JobAce are securely processed through Stripe. We do not store your credit card numbers or billing details on our servers.</p>`,
        },
        {
          id: 2,
          title: "How We Use Your Information",
          content: `<p>We use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Personalize your interview practice experience</li>
            <li>Track your performance and progress</li>
            <li>Send important account-related notifications</li>
          </ul>
          
          <p>If you become a paying member, we may also use your name and email address for:</p>
          <ul>
            <li>Sending JobAce newsletters</li>
            <li>Sharing interview tips, platform updates, and JobAce promotional content</li>
          </ul>
          
          <p>You may opt out of marketing emails at any time by clicking "unsubscribe" in any email footer.</p>`,
        },
        {
          id: 3,
          title: "Data Storage and Security",
          content: `<p>Your data is securely stored on encrypted servers.</p>
          <p>Voice recordings, transcripts, and your practice history are only available to you and are not shared with third parties.</p>
          <p>We employ strong security measures, including encryption, secure logins, and restricted access controls, to protect your information.</p>`,
        },
        {
          id: 4,
          title: "Data Sharing",
          content: `<p>We do not sell, rent, or trade your personal information.</p>
          <p>We only share necessary information with trusted service providers who support our operations, such as:</p>
          <ul>
            <li>Stripe (for payment processing)</li>
            <li>Cloud storage providers (for saving your practice data)</li>
          </ul>
          <p>These partners are contractually obligated to safeguard your data.</p>`,
        },
        {
          id: 5,
          title: "Your Rights",
          content: `<p>You have the right to:</p>
          <ul>
            <li>Access, review, and update your personal information</li>
            <li>Request deletion of your account and associated data</li>
          </ul>
          <p>To exercise your rights, please contact us at: <a href="mailto:customerservice@jobace.ca">customerservice@jobace.ca</a></p>`,
        },
        {
          id: 6,
          title: "Cookies and Tracking",
          content: `<p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Maintain login sessions</li>
            <li>Improve site performance</li>
            <li>Analyze usage patterns (aggregated and anonymized)</li>
          </ul>
          <p>You can adjust your cookie preferences through your browser settings.</p>`,
        },
        {
          id: 7,
          title: "Children's Privacy",
          content: `<p>JobAce is not intended for children under 16 years old. We do not knowingly collect data from minors.</p>`,
        },
        {
          id: 8,
          title: "Changes to This Policy",
          content: `<p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or in-app notifications.</p>`,
        },
        {
          id: 9,
          title: "Contact Us",
          content: `<p>If you have any questions about this Privacy Policy or our practices, please reach out to us: <a href="mailto:customerservice@jobace.ca">customerservice@jobace.ca</a></p>`,
        },
      ];
    },
  },
};
</script>

<style scoped>
.privacy-container {
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

.privacy-card {
  max-width: 1300px;
  margin: 0 auto;
  padding: 30px;
  margin-bottom: 30px;
}

.privacy-header {
  text-align: center;
  margin-bottom: 30px;
}

.privacy-header .title {
  color: #409eff;
  font-size: 28px;
  margin-bottom: 10px;
}

.effective-date {
  color: #909399;
  font-size: 14px;
}

.introduction-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
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

.content-section h3 {
  color: #606266;
  margin: 15px 0 8px 0;
  font-size: 16px;
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
  .privacy-container {
    padding: 10px;
  }

  .privacy-card {
    padding: 15px;
  }

  .privacy-header .title {
    font-size: 24px;
  }

  .content-section h2 {
    font-size: 18px;
  }

  .content-section h3 {
    font-size: 15px;
  }
}
</style>
