<template>
  <div class="terms-container">
    <el-card class="terms-card">
      <!-- Header Section -->
      <div class="terms-header">
        <h1 class="title">{{ termsContent.title }}</h1>
        <p class="effective-date">Effective Date: April 28, 2025</p>
      </div>

      <!-- Welcome Section -->
      <div class="section welcome-section">
        <h2>{{ termsContent.welcome.title }}</h2>
        <p>{{ termsContent.welcome.paragraph1 }}</p>
        <p class="important-note">{{ termsContent.welcome.paragraph2 }}</p>
      </div>

      <!-- Main Content Sections -->
      <div class="content-sections">
        <div
          v-for="(section, index) in termsContent.sections"
          :key="index"
          class="content-section"
        >
          <h2>{{ section.id }}. {{ section.title }}</h2>

          <template v-if="section.paragraphs">
            <p
              v-for="(para, pIndex) in section.paragraphs"
              :key="`para-${pIndex}`"
            >
              {{ para }}
            </p>
          </template>

          <template v-if="section.lists">
            <ul v-for="(list, lIndex) in section.lists" :key="`list-${lIndex}`">
              <li v-for="(item, iIndex) in list.items" :key="`item-${iIndex}`">
                {{ iIndex + 1 + ". " + item }}
              </li>
            </ul>
          </template>

          <template v-if="section.link">
            <p>
              Email: <a :href="`mailto:${section.link}`">{{ section.link }}</a>
            </p>
          </template>

          <template v-if="section.id === 8">
            <p>
              We collect and process your data in accordance with our
              <router-link to="/privacypolicy" class="privacy-link"
                >Privacy Policy</router-link
              >.
            </p>
            <p>
              By using our Services, you consent to this processing, including
              storing your practice recordings, transcripts, and progress
              history.
            </p>
          </template>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "TermsOfService",
  computed: {
    termsContent() {
      return {
        title: "JobAce Terms of Service",
        welcome: {
          title: "Welcome to JobAce!",
          paragraph1:
            'These Terms of Service ("Terms") govern your access to and use of the JobAce website, applications, and services (collectively, the "Services"). By using our Services, you agree to these Terms.',
          paragraph2: "Please read them carefully.",
        },
        sections: [
          {
            id: 1,
            title: "Eligibility",
            paragraphs: [
              "You must be at least 16 years old to use JobAce. By accessing or using our Services, you represent and warrant that you meet this age requirement.",
            ],
          },
          {
            id: 2,
            title: "Your Account",
            paragraphs: [
              "To access certain features, you must create an account or sign in with a third-party provider (e.g., Google).",
              "You are responsible for maintaining the security of your account and for all activities that occur under your account.",
            ],
          },
          {
            id: 3,
            title: "Services Provided",
            paragraphs: [
              "JobAce provides an AI-powered interview practice platform that enables users to:",
            ],
            lists: [
              {
                items: [
                  "Practice verbal responses to interview questions",
                  "Receive real-time feedback on tone, pacing, structure, and language",
                  "Access mock interviews and final assessment reports",
                  "Track performance and growth over time",
                ],
              },
            ],
            paragraphs2: [
              "We do not guarantee job placement or interview outcomes.",
            ],
          },
          {
            id: 4,
            title: "Payment and Subscriptions",
            paragraphs: [
              "Some features of JobAce require payment, either through:",
            ],
            lists: [
              {
                items: [
                  "Pay-per-use credits (individual session purchases)",
                  "Premium subscription (unlimited access during subscription term)",
                ],
              },
            ],
            paragraphs2: [
              "All fees are non-refundable except where required by law.",
              "Subscription plans may renew automatically unless canceled before the end of the billing cycle.",
            ],
          },
          {
            id: 5,
            title: "Free Trial",
            paragraphs: [
              "JobAce may offer a 7-day free trial to new users. Trial access includes a limited number of practice sessions and mock interviews.",
              "After the trial, you must purchase credits or subscribe to continue full access.",
            ],
          },
          {
            id: 6,
            title: "Acceptable Use",
            paragraphs: ["When using JobAce, you agree to:"],
            lists: [
              {
                items: [
                  "Use the Services only for lawful purposes",
                  "Not attempt to reverse engineer, disrupt, or exploit the platform",
                  "Not share offensive, harmful, or misleading content",
                ],
              },
            ],
            paragraphs2: [
              "We reserve the right to suspend or terminate accounts that violate these Terms.",
            ],
          },
          {
            id: 7,
            title: "Content and Intellectual Property",
            paragraphs: [
              "All software, AI models, text, graphics, audio, and other content provided by JobAce are owned by JobAce or its licensors.",
              "You may not reproduce, distribute, or create derivative works without express permission.",
            ],
          },
          {
            id: 8,
            title: "User Data and Privacy",
            // This section is now handled in the template with router-link
          },
          {
            id: 9,
            title: "Service Modifications",
            paragraphs: [
              "We may change, suspend, or discontinue any part of the Services at any time.",
              "We are not liable for any modification, price change, suspension, or discontinuation of the Services.",
            ],
          },
          {
            id: 10,
            title: "Disclaimers",
            paragraphs: [
              'The Services are provided "as is" without warranties of any kind.',
              "We do not guarantee that using JobAce will result in securing a job or passing any interview.",
            ],
          },
          {
            id: 11,
            title: "Limitation of Liability",
            paragraphs: [
              "To the fullest extent permitted by law, JobAce and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Services.",
            ],
          },
          {
            id: 12,
            title: "Governing Law",
            paragraphs: [
              "These Terms are governed by and construed in accordance with the laws of Province of Ontario, Canada, without regard to conflict of law principles.",
            ],
          },
          {
            id: 13,
            title: "Changes to These Terms",
            paragraphs: [
              "We may update these Terms from time to time.",
              "If changes are material, we will provide notice (such as via email or the platform). Your continued use of the Services after any update constitutes your acceptance of the new Terms.",
            ],
          },
          {
            id: 14,
            title: "Contact Us",
            paragraphs: [
              "If you have any questions about these Terms, please contact us at:",
            ],
            link: "customerservice@jobace.ca",
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
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

  .title {
    color: #000;
    font-size: 28px;
    margin-bottom: 10px;
  }

  .effective-date {
    color: #000;
    font-size: 14px;
    opacity: 0.7;
  }
}

.welcome-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;

  h2 {
    color: #000;
    margin-bottom: 15px;
  }

  p {
    color: #000;
  }

  .important-note {
    font-weight: bold;
    color: #000;
  }
}

.content-sections {
  margin-bottom: 20px;
}

.content-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  color: #000;

  &:last-child {
    border-bottom: none;
  }

  h2 {
    color: #000;
    margin-bottom: 15px;
    font-size: 20px;
  }

  ul {
    margin-left: 20px;
    margin-bottom: 15px;

    li {
      margin-bottom: 8px;
      color: #000;
      font-weight: 500;
    }
  }

  p {
    color: #000;
    margin-bottom: 15px;
  }

  a {
    color: #409eff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .privacy-link {
    color: #409eff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 768px) {
  .terms-container {
    padding: 10px;
  }

  .terms-card {
    padding: 15px;
  }

  .terms-header {
    .title {
      font-size: 24px;
    }
  }

  .content-section {
    h2 {
      font-size: 18px;
    }
  }
}
</style>
