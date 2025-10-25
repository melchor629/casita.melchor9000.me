import { Link } from '@melchor629/nice-ssr'
import { H1, H2 } from '#components/ui/index.ts'

export const metadata = {
  title: 'Privacy Policy',
}

const PrivacyPage = () => (
  <>
    <H1 className="pb-4">Privacy policy</H1>
    <p className="pb-2">
      This policy talks about the privacy of your data ("Personal Information") used
      in this website ("Website" or "Service") and related services. This site
      <Link to="/">auth.melchor9000.me</Link>
      is commited to keep your information safe and respect your privacy.
    </p>
    <p className="pb-2">
      This Policy is a legally binding agreement between you ("User", "you", "your")
      and this Website. If you do not agree with this Policy, you may not access nor
      use this Website and Services. By accessing it, you agree to this Policy, and
      acknowledge that you have read, understood and agree to be bound by the terms
      of this Policy. This Policy, on the other hand, does not apply to other Services
      that I do not control or own.
    </p>

    <H2 className="py-3">Collection of personal information</H2>
    <p className="pb-2">
      The required information about you is a username, email and personal name.
      This information will be obtained at login through other Services (as Google)
      or provided by you when asked.
    </p>
    <p className="pb-2">
      This information is not used for any other processing nor shared to other
      companies. All information will be kept in this service.
    </p>
    <p className="pb-2">
      You can choose not to provide with your Personal Information, but then you
      may not be able to use the Website.
    </p>

    <H2 className="py-3">Managing information</H2>
    <p className="pb-2">
      You are able to see and alter your information in the Website in the
      <Link to="/profile">Profile</Link>
      page once logged in. Any additional information that may not show up
      can be asked to me.
    </p>

    <H2 className="py-3">Disclosure of information</H2>
    <p className="pb-2">
      Your information is never shared to anyone, to keep your privacy and
      protect it from other agents.
    </p>

    <H2 className="py-3">Retention of Information</H2>
    <p className="pb-2">
      Your information is kept until your account is removed.
    </p>

    <H2 className="py-3">Cookies</H2>
    <p className="pb-2">
      Our Website and Services use "cookies" for providing the session service.
      No other cookies are used like for personalized experience or tracking.
    </p>
    <p className="pb-2">
      If cookies are not allowed, you may not use the Website at all.
    </p>

    <H2 className="py-3">Information security</H2>
    <p className="pb-2">
      I secure information you provide on our servers in a controlled, secure
      environment, protected from unauthorized access, use or disclosure. I
      maintain reasonable safeguards in an effort to protect your date from
      unauthorized access.
    </p>

    <H2 className="py-3">Data breach</H2>
    <p className="pb-2">
      In the event I become aware that the security of the Website and Services
      has been compromised or Personal Information has been disclosed, I will take
      the reasonable measures to investigate and report, in addition to other
      measures if needed.
    </p>
    <p className="pb-2">
      In case of this event, I will make reasonable efforts to notify the affected
      individuals by email or other ways.
    </p>
    <H2 className="py-3">Contacting us</H2>
    <p className="pb-2">
      If you have any questions, concerns or complaints regarding this Policy, the
      information we hold about you, or with to exercise your rights, we encourage
      you to contact me using the details below:
    </p>
    <div className="mb-2 text-center text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100 transition">
      <a href="mailto:melchor9000@gmail.com">melchor9000@gmail.com</a>
    </div>
    <p className="pt-3 opacity-75 select-none text-center">
      This document was last updated on May 10, 2025.
    </p>
  </>
)

export default PrivacyPage
