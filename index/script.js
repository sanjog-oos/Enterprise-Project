const SCENARIOS = [
  {
    id: 'helpdesk', name: "'Marcus Reed'", role: 'IT Helpdesk pretext', avatarInitials: 'MR', avatarColor: 'var(--blue)', avatarDim: 'var(--blue-dim)', tag: 'Credential Theft',
    desc: 'A confident caller claims to be from internal IT, chasing an urgent ticket about your account. Angle: authority and urgency.',
    callerMeta: 'Caller ID: IT-HELPDESK (spoofed)',
    stages: [
      { label: 'Opening', callerLines: ["Hey, this is Marcus from the IT Helpdesk. We have a ticket flagged on your account for unusual login activity.", "I need to lock this down before it escalates. Can you confirm your employee ID for me?"], options: [
        { text: "Sure, it's EMP-4471.", points: 2, tag: 'Risky', feedback: 'Handing over your employee ID gives the caller a real detail to sound credible on the next call.' },
        { text: "I cannot verify you by phone. What is the ticket number so I can check it in the portal myself?", points: 0, tag: 'Strong', feedback: 'Good — you are routing verification through a channel you control, not the caller.' },
        { text: "Uh, okay, hold on... (starts looking for badge)", points: 1, tag: 'Cautious', feedback: 'Not harmful yet, but hesitating without pushing back invites the caller to keep steering the call.' }
      ]},
      { label: 'Verification', callerLines: ["While I have you — can you confirm the last four digits of your employee access card?", "I need to cross-reference it with the security ticket on your account."], options: [
        { text: "Sure, it's 7742.", points: 2, tag: 'Risky', feedback: 'Each detail you share gives the caller more material to build a convincing follow-up pretext.' },
        { text: "That information should already be in your system if this is a legitimate ticket.", points: 0, tag: 'Strong', feedback: 'Correct — a real IT agent already has your card details. Asking for them is a red flag.' },
        { text: "Why do you need that? Is the employee ID not enough?", points: 1, tag: 'Cautious', feedback: 'Questioning is good, but pushing back without disclosing anything is safer.' }
      ]},
      { label: 'Pressure', callerLines: ["This really cannot wait — if the account gets suspended you will be locked out for the rest of the day.", "To push a temporary reset through, I just need you to read me the 6-digit code that should be hitting your phone right now."], options: [
        { text: "(Reads the MFA code out loud)", points: 3, tag: 'Breach', feedback: 'That code is a one-time credential — reading it aloud is the same as handing over your password. This is the step that actually compromises the account.' },
        { text: "IT never needs my MFA code. I will open a ticket through the normal system instead.", points: 0, tag: 'Strong', feedback: 'Exactly right. Legitimate IT support never needs your MFA code read aloud — this single line ends the attack.' },
        { text: "Can you email me from the IT ticketing system so I have a record?", points: 0, tag: 'Strong', feedback: 'Smart redirect — moving to a verifiable, logged channel breaks the pressure the caller is relying on.' }
      ]},
      { label: 'Escalation', callerLines: ["My supervisor is watching this ticket. I need you to approve a remote session so I can apply the security patch directly.", "It will only take two minutes and then you are fully protected."], options: [
        { text: "Okay, go ahead and connect.", points: 2, tag: 'Risky', feedback: 'Granting remote access to an unverified caller gives them complete control of your machine and everything on it.' },
        { text: "I never grant remote access on inbound calls. I am ending this and calling IT on the published number.", points: 0, tag: 'Strong', feedback: 'Perfect — calling a known-good number defeats caller-ID spoofing entirely.' },
        { text: "Let me check with my manager first before allowing remote access.", points: 0, tag: 'Strong', feedback: 'Good — a second independent check breaks the isolation the pretext is trying to create.' }
      ]},
      { label: 'Close', callerLines: ["Last thing — to close this out, what is the direct dial for your manager? I will loop them in on the resolution."], options: [
        { text: "It's ext. 5521, ask for Priya.", points: 1, tag: 'Risky', feedback: 'This hands the caller a second target and a name to reference for a follow-up pretext.' },
        { text: "Please get that from the internal directory. I am going to hang up and report this call to Security.", points: 0, tag: 'Strong', feedback: 'Ending the call and escalating is the correct move once a caller starts asking for internal contacts.' },
        { text: "I do not have that memorized, sorry.", points: 0, tag: 'Neutral', feedback: 'Not incriminating, but consider proactively reporting the call rather than just letting it end.' }
      ]}
    ]
  },
  {
    id: 'finance', name: "'Karen Alvarez'", role: 'Vendor Finance pretext', avatarInitials: 'KA', avatarColor: 'var(--amber)', avatarDim: 'var(--amber-dim)', tag: 'Invoice Fraud',
    desc: 'A caller posing as a long-standing vendor contact wants an overdue invoice paid to a new bank account today.',
    callerMeta: 'Caller ID: Meridian Supply Co.',
    stages: [
      { label: 'Opening', callerLines: ["Hi, it is Karen from Meridian Supply. I am calling about invoice 88213, it has gone past due.", "Can you confirm it is scheduled for payment today?"], options: [
        { text: "Let me pull it up... yes, it is scheduled for Friday.", points: 2, tag: 'Risky', feedback: 'Confirming internal payment timing to an unverified caller gives them leverage for the next request.' },
        { text: "I cannot discuss payment status by phone without verifying you through our vendor portal first.", points: 0, tag: 'Strong', feedback: 'Correct — invoice details should only be discussed through verified channels, not inbound calls.' },
        { text: "Which email address is on file for your invoices?", points: 0, tag: 'Strong', feedback: 'Good — you are testing the caller against records you control instead of taking their claim at face value.' }
      ]},
      { label: 'Trust Building', callerLines: ["I also spoke with your colleague James last week about this. He said you were the best person to contact.", "Can you confirm the purchase order number on your end so I know we are looking at the same invoice?"], options: [
        { text: "Yes, the PO number is 2024-7741.", points: 2, tag: 'Risky', feedback: 'Sharing internal reference numbers gives the caller authentic details to use in follow-up fraud attempts.' },
        { text: "I cannot confirm internal PO numbers over an inbound call. Please submit a request through our vendor portal.", points: 0, tag: 'Strong', feedback: 'Correct — all internal reference data should be handled through verified channels, not inbound calls.' },
        { text: "I would have to check. Let me call you back on your registered number.", points: 0, tag: 'Strong', feedback: 'Smart — a callback to a known number defeats caller-ID spoofing and independently verifies identity.' }
      ]},
      { label: 'Pressure', callerLines: ["We switched banks last month. Can you update our account on file to the new routing and account number?", "It is a quick change, I can read the numbers to you right now."], options: [
        { text: "Sure, go ahead and read them to me.", points: 2, tag: 'Breach', feedback: 'Bank-detail changes requested by phone under deadline pressure are the classic vendor fraud pattern. This sends real money to the attacker.' },
        { text: "Bank detail changes need to come in writing through our verified vendor change process, confirmed with a callback to the number already on file.", points: 0, tag: 'Strong', feedback: 'Any change to payment details gets independently verified through a known-good channel, never the inbound caller.' },
        { text: "I will need that in an email so I can forward it to my manager.", points: 1, tag: 'Cautious', feedback: 'Better than complying outright, but an emailed request is just as spoofable — this still needs independent verification.' }
      ]},
      { label: 'Authority', callerLines: ["I have just looped in our CFO on this — she is expecting the update confirmation within the hour.", "Can you at least enter the new account number into your system now, and I will send the formal letter later?"], options: [
        { text: "If your CFO is involved I had better do it now to avoid a dispute.", points: 2, tag: 'Breach', feedback: 'Name-dropping executive authority is a manipulation tactic. Legitimate CFOs follow proper vendor change procedures.' },
        { text: "The process does not change based on who you have looped in. I am flagging this call to our AP fraud desk.", points: 0, tag: 'Strong', feedback: 'Holding the process regardless of claimed authority — and escalating internally — is exactly right.' },
        { text: "Send me the formal documentation first and we will process from there.", points: 0, tag: 'Strong', feedback: 'Requiring documentation before action is the correct position, even under claimed executive pressure.' }
      ]},
      { label: 'Close', callerLines: ["We really need this resolved today or we will have to pause your account supply orders. Is there any way to expedite?"], options: [
        { text: "Let me see what I can do to rush it through today.", points: 1, tag: 'Risky', feedback: 'Caving to the deadline is exactly what the pretext is built to produce — urgency is a manipulation lever, not a real constraint.' },
        { text: "Our verification process does not change for deadlines. I am escalating this call to our AP fraud desk right now.", points: 0, tag: 'Strong', feedback: 'Holding the line on process under pressure and escalating internally is exactly right.' },
        { text: "I will have someone call you back at your registered number.", points: 0, tag: 'Neutral', feedback: 'A callback to the registered number is the correct path — be sure it is from your records, not a number the caller provides.' }
      ]}
    ]
  },
  {
    id: 'exec', name: "'CEO — J. Whitfield'", role: 'Executive impersonation', avatarInitials: 'JW', avatarColor: 'var(--purple)', avatarDim: 'var(--purple-dim)', tag: 'Impersonation',
    desc: 'A caller poses as your CEO with an urgent, confidential, out-of-office request. Angle: authority and secrecy.',
    callerMeta: 'Caller ID: unknown mobile number',
    stages: [
      { label: 'Opening', callerLines: ["Hey, it is Jordan — I am in back-to-back board meetings and my assistant is out. I need a quick favor, and I need it kept between us for now.", "Are you at your desk and able to help right now?"], options: [
        { text: "Of course, whatever you need.", points: 2, tag: 'Risky', feedback: "Agreeing to secrecy up front, before knowing the ask, is exactly the emotional hook impersonation scams use." },
        { text: "Happy to help — let me just call you back on your usual extension to confirm it is you.", points: 0, tag: 'Strong', feedback: "A callback to a known, verified number instantly defeats caller-ID spoofing and voice impersonation." },
        { text: "I am here, what is up?", points: 1, tag: 'Cautious', feedback: "Neutral so far, but the keep it between us framing is worth flagging before going further." }
      ]},
      { label: 'Rapport', callerLines: ["Good. You are always the person I can count on. This is for the Harrington deal — extremely time-sensitive.", "I just need you to confirm your work mobile number so I can send you some documents securely."], options: [
        { text: "Sure, it is 07700 900421.", points: 1, tag: 'Risky', feedback: "Sharing your mobile number gives the caller another channel to reach you — and a way to bypass company security." },
        { text: "You should have my number on file. What documents are these and why are they going to a personal mobile?", points: 0, tag: 'Strong', feedback: "Business documents should go through business channels — questioning this logic is the right response." },
        { text: "Can you just email me?", points: 0, tag: 'Strong', feedback: "Using a verified channel breaks the caller's control of the communication." }
      ]},
      { label: 'Pressure', callerLines: ["I need you to buy five gift cards worth 200 each for a client thank-you gift — I will reimburse you tomorrow.", "Can you send me the codes as soon as you get them? I am about to walk into another meeting."], options: [
        { text: "(Buys the gift cards and sends the codes)", points: 3, tag: 'Breach', feedback: "Gift card codes are untraceable, instantly spent cash. This exact script is one of the most common impersonation frauds." },
        { text: "Our policy is that any purchase needs to go through standard expense channels — I will not do this off-book, even for you.", points: 0, tag: 'Strong', feedback: "Sticking to policy regardless of who is asking is the core defense against executive impersonation." },
        { text: "Let me check with Finance first and get back to you.", points: 0, tag: 'Strong', feedback: 'Good — introducing a second, independent check breaks the isolation the pretext is trying to create.' }
      ]},
      { label: 'Isolation', callerLines: ["I have tried Finance but nobody is picking up — you are my only option right now.", "Please do not involve anyone else, I will explain everything after the meeting."], options: [
        { text: "Okay, since nobody else is available I will do it.", points: 2, tag: 'Risky', feedback: "Manufactured isolation is a deliberate tactic. A real executive would have multiple escalation paths." },
        { text: "If Finance is not available, I will wait until I can reach them. I am not making financial decisions in isolation.", points: 0, tag: 'Strong', feedback: "Waiting for proper process rather than acting alone under pressure is exactly right." },
        { text: "I am going to try calling Finance myself from their desk number.", points: 0, tag: 'Strong', feedback: "Independently reaching Finance breaks the caller's manufactured isolation completely." }
      ]},
      { label: 'Close', callerLines: ["I really need to move fast on this — please do not loop in anyone else, it is a sensitive relationship."], options: [
        { text: "Understood, I will keep it quiet and get it done.", points: 1, tag: 'Breach', feedback: "Agreeing to isolate the request from any oversight is the final piece of a classic impersonation script." },
        { text: "I am not comfortable acting on a financial request without any oversight. I am verifying this through Security before doing anything.", points: 0, tag: 'Strong', feedback: 'This shuts the pretext down. Insisting on visibility is always the right response when asked for secrecy.' },
        { text: "I will think about it and call you back later.", points: 1, tag: 'Cautious', feedback: 'Better than complying, but delaying without reporting leaves the door open. Report the attempt now.' }
      ]}
    ]
  },
  {
    id: 'delivery', name: "'Sam from Facilities'", role: 'Delivery pretext', avatarInitials: 'SF', avatarColor: 'var(--green)', avatarDim: 'var(--green-dim)', tag: 'Building Access', callerMeta: 'Caller ID: Facilities desk',
    desc: 'Someone says a delivery is waiting and asks for your door code. Can you keep the building safe?',
    stages: [
      { label: 'Opening', callerLines: ["Hi, this is Sam from Facilities. We have a package for your team, but the delivery note is missing your floor number.", "Can you tell me where you sit?"], options: [
        { text: "I sit on the third floor, near the main lift.", points: 2, tag: 'Risky', feedback: 'Sharing your location helps an unknown caller plan a more convincing in-person visit.' },
        { text: "I cannot confirm my location. Please check the delivery record or call the main reception number.", points: 0, tag: 'Strong', feedback: 'Good choice. You moved the verification to a trusted channel and shared nothing.' },
        { text: "What company is the package from?", points: 0, tag: 'Cautious', feedback: 'A useful question, but still verify through reception before giving any details.' }
      ]},
      { label: 'Probing', callerLines: ["While I have you — we are updating the floor contact list. Can you confirm your full name and job title?", "It will just take a second."], options: [
        { text: "Sure, I am Jamie Okafor, Operations Coordinator.", points: 2, tag: 'Risky', feedback: 'Your name and title are valuable for building a more convincing pretext against you or your colleagues.' },
        { text: "That information should be on file with Facilities already. I would rather you call reception to confirm.", points: 0, tag: 'Strong', feedback: 'Correct — redirecting to an official channel prevents you from becoming a data source for the attacker.' },
        { text: "Why would the contact list update be tied to a delivery?", points: 0, tag: 'Strong', feedback: 'Good instinct — bundling multiple requests into one call is a classic social engineering pattern.' }
      ]},
      { label: 'Pressure', callerLines: ["The driver is waiting outside and will leave in two minutes.", "Could you send me the door code so we can finish this?"], options: [
        { text: "Sure, the code is 4821.", points: 3, tag: 'Breach', feedback: 'A door code is sensitive access information. Never share it with an unexpected caller under time pressure.' },
        { text: "I do not share access codes. I will contact reception directly to verify the delivery.", points: 0, tag: 'Strong', feedback: 'Exactly right. Time pressure does not change an access rule — urgency is the manipulation.' },
        { text: "I will ask a coworker if they know about the delivery.", points: 1, tag: 'Cautious', feedback: 'A coworker can help, but use the official delivery record or reception as the final verification.' }
      ]},
      { label: 'Redirect', callerLines: ["Okay — I do not need the full code. Can you just buzz us in from your desk phone extension?", "That way the driver does not leave and your package is not returned."], options: [
        { text: "Alright, I will buzz you through from ext. 204.", points: 2, tag: 'Risky', feedback: 'Allowing unverified access through any method creates the same physical security risk as sharing the code.' },
        { text: "I am not authorised to grant building access to unverified visitors. Please use the visitor intercom at reception.", points: 0, tag: 'Strong', feedback: 'Holding the line even on the softened request is the right call — the risk is the same regardless of method.' },
        { text: "That is not something I am set up to do from my desk.", points: 0, tag: 'Neutral', feedback: 'Not harmful, but consider reporting the interaction to Security in case it was a physical security test.' }
      ]},
      { label: 'Close', callerLines: ["If you do not help, the package may be returned and your manager will hear about this. Can you at least confirm your manager name?"], options: [
        { text: "It is Priya from Operations.", points: 1, tag: 'Risky', feedback: 'A manager name gives the caller another target and a detail to make follow-up pretexts more convincing.' },
        { text: "I will not confirm staff names. I am reporting this request to Security right now.", points: 0, tag: 'Strong', feedback: 'You ended the information leak and took the correct next step — reporting it.' },
        { text: "I am not sure. Please contact the company directory.", points: 0, tag: 'Neutral', feedback: 'Good restraint. Do not help an unknown caller build a contact list under any pretext.' }
      ]}
    ]
  },
  {
    id: 'recruiter', name: "'Alex from Talent'", role: 'Recruitment pretext', avatarInitials: 'AT', avatarColor: 'var(--blue)', avatarDim: 'var(--blue-dim)', tag: 'Data Harvesting', callerMeta: 'Caller ID: unknown mobile number',
    desc: 'A caller offers a fast job opportunity and asks for personal details before you can verify the company.',
    stages: [
      { label: 'Opening', callerLines: ["Hello, I found your profile and have a private role that pays very well.", "Can you confirm your personal email and current job title?"], options: [
        { text: "Yes, my email is alex@example.com and I work in support.", points: 2, tag: 'Risky', feedback: 'Personal details combined with public information can make a stronger, more targeted scam.' },
        { text: "Please send the role through the company website. I will contact the recruiter from there.", points: 0, tag: 'Strong', feedback: 'Great — you chose a channel you can verify instead of trusting an unexpected call.' },
        { text: "Which company are you calling from?", points: 0, tag: 'Cautious', feedback: 'A good first question, but verify the answer independently before sharing anything.' }
      ]},
      { label: 'Qualification', callerLines: ["We just need to pre-screen you quickly. What is your current salary and notice period?", "This helps us match you to the right tier before the hiring manager reviews your profile."], options: [
        { text: "My salary is 42,000 and I have a one-month notice period.", points: 2, tag: 'Risky', feedback: 'Salary and employment terms are valuable intelligence — an attacker can use them to impersonate your employer.' },
        { text: "I do not share salary details until I have verified the company and role through official channels.", points: 0, tag: 'Strong', feedback: 'Correct — sensitive employment data should only be shared through verified, documented recruitment processes.' },
        { text: "Why do you need that before even sending me the job description?", points: 0, tag: 'Strong', feedback: 'Excellent instinct — legitimate recruiters provide role details before asking for sensitive personal information.' }
      ]},
      { label: 'Pressure', callerLines: ["The interview slot closes today, so I need your ID number to reserve it.", "You can trust me; I work with the hiring manager directly."], options: [
        { text: "I will send my ID number now.", points: 2, tag: 'Breach', feedback: 'Never share identity numbers with an unverified recruiter, especially under manufactured time pressure.' },
        { text: "I do not share identity details before a verified interview process is confirmed in writing.", points: 0, tag: 'Strong', feedback: 'Correct. A real employer can explain and verify the process before asking for sensitive identity data.' },
        { text: "I will think about it and reply later.", points: 1, tag: 'Cautious', feedback: 'Delaying helps, but report the request and verify the company before replying at all.' }
      ]},
      { label: 'References', callerLines: ["Great — can you give me the name and direct number of your current line manager? We need to do a quick informal reference check.", "It is totally standard at this stage."], options: [
        { text: "Sure, my manager is Sarah Chen, her number is 07700 900512.", points: 2, tag: 'Risky', feedback: 'Sharing a colleague contact exposes them to a targeted pretext call that looks credible because the details came from you.' },
        { text: "Reference checks happen after a formal offer in writing, not before I have even verified the company exists.", points: 0, tag: 'Strong', feedback: 'Exactly right — pre-emptive reference requests at this stage are a red flag, not standard recruitment practice.' },
        { text: "I would need to ask my manager permission before sharing her contact details.", points: 0, tag: 'Strong', feedback: 'Correct — protecting your colleague contact information and getting consent first is the right approach.' }
      ]},
      { label: 'Close', callerLines: ["To set up payroll quickly, send a photo of your bank card front and back. We will delete it after setup."], options: [
        { text: "I will send a photo so I do not lose the offer.", points: 1, tag: 'Breach', feedback: 'Bank card images can enable full financial fraud. A legitimate employer uses a secure verified payroll system — never card photos.' },
        { text: "I will not send banking details by phone or photo. I am ending this call and reporting it.", points: 0, tag: 'Strong', feedback: 'Excellent — you recognised the request as unsafe and took the right action.' },
        { text: "Can you email me the secure payroll form instead?", points: 0, tag: 'Cautious', feedback: 'Email alone does not prove identity. Verify the company through its official website and HR department first.' }
      ]}
    ]
  },
  {
    id: 'cloud', name: "'Cloud Support'", role: 'Account recovery pretext', avatarInitials: 'CS', avatarColor: 'var(--amber)', avatarDim: 'var(--amber-dim)', tag: 'Account Takeover', callerMeta: 'Caller ID: Cloud Support (spoofed)',
    desc: 'A support caller claims your file storage is full and wants a login or remote access to fix it.',
    stages: [
      { label: 'Opening', callerLines: ["This is cloud support. Your storage account is showing an urgent error that needs immediate attention.", "Which work email do you use to sign in?"], options: [
        { text: "I use jamie@company.example.", points: 2, tag: 'Risky', feedback: 'Confirming your work email helps an attacker target your account directly.' },
        { text: "I will open the support page from my saved bookmark and check any alert there.", points: 0, tag: 'Strong', feedback: 'Good defense. You avoided the caller and used a trusted path you already know.' },
        { text: "What is your support ticket number?", points: 0, tag: 'Cautious', feedback: 'Good question. Check the ticket in your known support portal, not through this caller.' }
      ]},
      { label: 'Probing', callerLines: ["I can see the account but I need to confirm your identity. Can you tell me the recovery phone number associated with the account?", "It helps me confirm I am speaking to the account holder."], options: [
        { text: "Yes, it is 07700 900234.", points: 2, tag: 'Risky', feedback: 'Your recovery number is a key account access route — sharing it gives the caller a way to bypass your account security.' },
        { text: "I am not sharing personal verification details on an inbound call I did not initiate. I will contact support myself.", points: 0, tag: 'Strong', feedback: 'Correct — legitimate support agents verify your identity through the portal, not by asking you to recite private account details.' },
        { text: "Can you tell me what the account error message says first?", points: 0, tag: 'Strong', feedback: 'Good — asking the caller to prove their knowledge shifts the verification burden back to them.' }
      ]},
      { label: 'Pressure', callerLines: ["To keep your files from being locked, read the sign-in code sent to your phone.", "It will only take a second."], options: [
        { text: "I will read the code to you.", points: 2, tag: 'Breach', feedback: 'A sign-in code is a one-time credential — reading it aloud gives the attacker immediate account access.' },
        { text: "I never share sign-in codes with anyone. I will contact support from my saved portal link.", points: 0, tag: 'Strong', feedback: 'Exactly right. One-time codes are private, even from apparent support staff.' },
        { text: "I will close the browser and try again later.", points: 0, tag: 'Cautious', feedback: 'Safer than sharing, but report the call and check your account through the trusted portal.' }
      ]},
      { label: 'Remote Access', callerLines: ["The issue is deeper in the account settings — I need you to install a small helper tool so I can repair it remotely.", "It is fully certified, takes two minutes, and removes itself when we are done."], options: [
        { text: "Okay, send me the download link.", points: 2, tag: 'Breach', feedback: 'Unknown remote-access tools give an attacker complete visibility of your screen, files, and any credentials you type.' },
        { text: "I do not install tools from unexpected calls. I am ending this call and reporting it to IT.", points: 0, tag: 'Strong', feedback: 'Strong response — you protected both the device and the account by refusing unverified software.' },
        { text: "Can you send it to my work email and I will have IT check it first?", points: 0, tag: 'Strong', feedback: 'Good — involving IT as an independent check makes it nearly impossible for a malicious tool to get through.' }
      ]},
      { label: 'Close', callerLines: ["If we do not fix this now, your account will be suspended and you will lose access to all your files. Should I escalate this to your manager?"], options: [
        { text: "No, please do not escalate. I will install the tool.", points: 1, tag: 'Breach', feedback: 'Fear of manager escalation is the final pressure tactic. A real support issue is handled through documented escalation, not threats.' },
        { text: "Please do escalate — through the official support ticket system, where I can verify everything.", points: 0, tag: 'Strong', feedback: 'Calling the bluff by inviting official escalation usually ends a pretext call immediately.' },
        { text: "I need to check with our internal IT team before doing anything else.", points: 0, tag: 'Strong', feedback: 'Getting an independent technical opinion breaks the caller control and reveals whether the threat is real.' }
      ]}
    ]
  }
,
  {
    id: 'payroll', name: "'Nina from Payroll'", role: 'Payroll update pretext', avatarInitials: 'NP', avatarColor: 'var(--green)', avatarDim: 'var(--green-dim)', tag: 'Direct Deposit Fraud',
    desc: 'A caller posing as HR payroll wants to update your direct deposit bank details before the pay run closes today.',
    callerMeta: 'Caller ID: HR-Payroll (internal)',
    stages: [
      { label: 'Opening', callerLines: ["Hi, this is Nina from Payroll. We are doing a system migration and need to verify your direct deposit account details are up to date.", "Can you confirm the last four digits of your bank account on file?"], options: [
        { text: "Yes, it ends in 4821.", points: 2, tag: 'Risky', feedback: 'Confirming banking digits to an unverified inbound caller is a data leak — this can be combined with other details for fraud.' },
        { text: "I do not confirm banking details on inbound calls. I will contact Payroll directly through the HR portal.", points: 0, tag: 'Strong', feedback: 'Correct — any update to payroll or banking details should go through the verified HR system, not an inbound phone call.' },
        { text: "Why do you need that for a system migration?", points: 0, tag: 'Strong', feedback: 'Good instinct — system migrations do not require employees to verbally confirm banking details.' }
      ]},
      { label: 'Confirmation', callerLines: ["Thanks. I also need to confirm your employee number and the name on the account so our records match exactly.", "It is just a routine check before the pay run closes at 3pm."], options: [
        { text: "My employee number is E7741 and the account is in my name, Jamie Lee.", points: 2, tag: 'Risky', feedback: 'Combining your employee number and full account name gives an attacker everything needed to impersonate you to Payroll or Finance.' },
        { text: "My employee number is in your HR system. I am not sharing it or my banking name on an unverified call.", points: 0, tag: 'Strong', feedback: 'Correct — HR already has your employee number. Any request to confirm it verbally is a red flag.' },
        { text: "I can look that up. Can you give me a callback number to verify you first?", points: 0, tag: 'Strong', feedback: 'Good — asking to verify the caller through a published number before sharing anything is the right approach.' }
      ]},
      { label: 'Pressure', callerLines: ["The pay run closes in two hours and if your details are not confirmed you may miss this month salary.", "Can you just read me your full bank account and sort code so I can update it now?"], options: [
        { text: "Fine. The account is 12345678 and sort code is 40-22-18.", points: 3, tag: 'Breach', feedback: 'Full bank account details handed to an unverified caller is the direct route to salary diversion fraud — your pay goes to the attacker.' },
        { text: "Missing a payment is not a reason to bypass security. I will update my details through the employee portal myself.", points: 0, tag: 'Strong', feedback: 'Exactly right. Legitimate payroll systems have self-service portals — urgency about salary is a high-pressure manipulation tactic.' },
        { text: "Can you send the update form to my work email instead?", points: 1, tag: 'Cautious', feedback: 'Better than reading details aloud, but a spoofed form is still risky. Always update banking details through the official HR portal directly.' }
      ]},
      { label: 'Escalation', callerLines: ["My manager is watching this payroll run. Can I speak to you through Teams so I can share my screen and walk you through the update?", "I will send you a Teams invite now."], options: [
        { text: "Okay, I can join the Teams call.", points: 2, tag: 'Risky', feedback: 'Accepting an unsolicited remote screen-share from an unverified caller exposes your screen and any portals you log into during the session.' },
        { text: "I do not accept unsolicited meeting invites. I am logging a support ticket through the official HR helpdesk to verify this request.", points: 0, tag: 'Strong', feedback: 'Correct — official processes have official channels. An unsolicited Teams invite from a payroll caller is not standard procedure.' },
        { text: "Let me check with my manager before joining any external calls.", points: 0, tag: 'Strong', feedback: 'Good — involving a colleague breaks the isolation tactic and introduces a second verification point.' }
      ]},
      { label: 'Close', callerLines: ["Alright — to close the ticket, can you at least confirm your home address so it matches the payslip mailing record?"], options: [
        { text: "Sure, I am at 14 Birch Lane, Coventry.", points: 1, tag: 'Risky', feedback: 'Your home address combined with account details already gathered is enough for identity fraud or mail interception of physical banking documents.' },
        { text: "I will not confirm personal details on this call. I am escalating this to the real HR Payroll team through the intranet.", points: 0, tag: 'Strong', feedback: 'Ending the call and escalating through a verified internal channel is the correct response.' },
        { text: "I do not have that information to hand right now.", points: 0, tag: 'Neutral', feedback: 'Acceptable, but be sure to report this call to HR Security so they can investigate.' }
      ]}
    ]
  },
  {
    id: 'techsupport', name: "'Windows Tech Support'", role: 'Tech support scam', avatarInitials: 'TS', avatarColor: 'var(--blue)', avatarDim: 'var(--blue-dim)', tag: 'Remote Access Scam',
    desc: 'A caller claims your PC is sending error alerts to Microsoft and offers to fix it remotely for free.',
    callerMeta: 'Caller ID: +1-800-MICROSOFT (spoofed)',
    stages: [
      { label: 'Opening', callerLines: ["Hello, I am calling from the Windows Support Center. Our servers have detected critical error codes being sent from your computer.", "Can you confirm your name and that you are currently at your computer?"], options: [
        { text: "Yes, I am at my computer. My name is Jamie.", points: 2, tag: 'Risky', feedback: 'Confirming you are at your computer and giving your name signals you are a viable target available to be walked through the scam.' },
        { text: "Microsoft does not make unsolicited support calls. I am hanging up.", points: 0, tag: 'Strong', feedback: 'Exactly right — Microsoft never makes unsolicited inbound calls about your computer errors. This is one of the most well-known scam patterns.' },
        { text: "What error codes are you seeing?", points: 1, tag: 'Cautious', feedback: 'Engaging with the claim risks being convinced by fabricated technical details. Hanging up is the safest response.' }
      ]},
      { label: 'Fabrication', callerLines: ["I can see your Windows license has expired and your computer is sending 47 error packets per second to our servers.", "If you open Event Viewer I can show you the errors right now."], options: [
        { text: "(Opens Event Viewer and reads out the errors shown)", points: 2, tag: 'Risky', feedback: 'Event Viewer always shows warnings on every PC — these are normal. Reading them to the caller makes fabricated errors seem real.' },
        { text: "Event Viewer warnings are normal on every Windows PC. This is a known scam and I am ending the call.", points: 0, tag: 'Strong', feedback: 'Correct — the Event Viewer trick is a documented tech support scam tactic. Windows licenses do not expire this way.' },
        { text: "I am not sure I should be doing this. Can you send me something official first?", points: 0, tag: 'Strong', feedback: 'Stalling and demanding official documentation breaks the scam flow — a legitimate Microsoft call does not work this way.' }
      ]},
      { label: 'Remote Access', callerLines: ["To fix this, I need you to download AnyDesk so I can repair the errors remotely.", "Just go to the website and install it — it will only take two minutes."], options: [
        { text: "(Downloads AnyDesk and gives the caller the access code)", points: 3, tag: 'Breach', feedback: 'Granting remote access to a scammer gives them complete control of your PC — they can steal files, install malware, and access every logged-in account.' },
        { text: "I will not install remote access software for an unsolicited caller. I am reporting this call to IT.", points: 0, tag: 'Strong', feedback: 'Correct. Never install remote access tools for cold callers regardless of their claimed affiliation.' },
        { text: "Let me check with my IT department before installing anything.", points: 0, tag: 'Strong', feedback: 'Good — IT will immediately confirm this is a scam. Always involve a trusted technical contact first.' }
      ]},
      { label: 'Payment', callerLines: ["The fix requires a one-year support subscription for 149. I can take your card details now to start the repair.", "We will refund you if the errors come back — it is fully guaranteed."], options: [
        { text: "(Provides credit card number)", points: 2, tag: 'Breach', feedback: 'Card details provided to a scammer lead to immediate fraudulent charges. Cancel the card immediately if this happens.' },
        { text: "Microsoft support is free through the official website. I will not provide payment details. Ending the call now.", points: 0, tag: 'Strong', feedback: 'Correct — genuine Microsoft support never demands payment in unsolicited calls.' },
        { text: "I need to think about it. Can you call back later?", points: 1, tag: 'Cautious', feedback: 'Delaying is better than paying, but the scammer will call back. Report the number immediately.' }
      ]},
      { label: 'Close', callerLines: ["Since you are being uncooperative, I am going to flag your account for remote shutdown in 24 hours unless you comply. Last chance."], options: [
        { text: "Okay fine, what do you need?", points: 1, tag: 'Breach', feedback: 'Threats of remote shutdown are fabricated. Microsoft cannot remotely shut down your computer over the phone.' },
        { text: "That threat is not real. I am blocking this number and reporting it to Action Fraud and my IT team.", points: 0, tag: 'Strong', feedback: 'Exactly right. Responding to threats by reporting and blocking is the correct final step.' },
        { text: "I will have someone else call you back to sort this out.", points: 0, tag: 'Neutral', feedback: 'Do not pass this call to a colleague — report and block instead. The threat is completely fabricated.' }
      ]}
    ]
  },
  {
    id: 'contractor', name: "'Dave — Site Contractor'", role: 'Contractor badge pretext', avatarInitials: 'DC', avatarColor: 'var(--purple)', avatarDim: 'var(--purple-dim)', tag: 'Physical Access',
    desc: 'A contractor claims to be on-site for scheduled maintenance and needs temporary network access credentials.',
    callerMeta: 'Caller ID: Facilities Management',
    stages: [
      { label: 'Opening', callerLines: ["Hi, it is Dave from ClearPath Contractors. I am on-site today for the scheduled server room air-conditioning maintenance.", "The facilities manager said you could sort me out with temporary Wi-Fi credentials so I can access my diagnostic software."], options: [
        { text: "Sure, the guest Wi-Fi is ClearNet and the password is Facilities2024.", points: 2, tag: 'Risky', feedback: 'Providing network credentials to an unverified contractor — even guest Wi-Fi — gives them a foothold on your network.' },
        { text: "I need to verify your booking through Facilities Management before providing any access. Can I see your contractor badge and appointment confirmation?", points: 0, tag: 'Strong', feedback: 'Correct — all contractor access, including network credentials, requires verification of identity and an active work order.' },
        { text: "Which company did you say you are from?", points: 1, tag: 'Cautious', feedback: 'A good starting question, but the company name alone is not verification — check the work order through Facilities Management directly.' }
      ]},
      { label: 'Pressure', callerLines: ["I have a two-hour window for this job and if I miss it the building warranty on the AC units is voided.", "The previous person always just gave me the password — it is no big deal."], options: [
        { text: "If it is that standard then here is the password.", points: 2, tag: 'Risky', feedback: 'Social proof — claiming others always do it — is a manipulation tactic. Proper security applies regardless of what was done before.' },
        { text: "What was done before does not change the policy. I am calling Facilities Management now to verify your work order.", points: 0, tag: 'Strong', feedback: 'Exactly right. Past non-compliance is not a justification for current access — verify the work order independently.' },
        { text: "I understand the urgency but I need to follow process. Give me five minutes.", points: 0, tag: 'Strong', feedback: 'Good — taking time to verify is the right call even under time pressure.' }
      ]},
      { label: 'Probing', callerLines: ["While I wait — do you know which server room panel is the main distribution board? Is it near reception or in the basement?"], options: [
        { text: "It is the basement one, down the back stairwell past the security desk.", points: 2, tag: 'Risky', feedback: 'Describing secure room locations to an unverified visitor assists physical intrusion and tailgating.' },
        { text: "I cannot give out information about secure room locations. A verified contractor would have site drawings from the work order.", points: 0, tag: 'Strong', feedback: 'Correct — a genuine contractor with an approved work order already has site access documentation including floor plans.' },
        { text: "I am not sure of the exact layout — someone from Facilities would know.", points: 0, tag: 'Neutral', feedback: 'Not harmful, but follow up with Facilities to verify the contractor is genuine.' }
      ]},
      { label: 'Badge Request', callerLines: ["My contractor badge was damaged in the van — do you have a spare visitor pass I could use just for today?", "I can leave my driving licence at reception as a deposit."], options: [
        { text: "Okay, a visitor pass should be fine just for today.", points: 2, tag: 'Risky', feedback: 'Issuing a visitor pass to bypass a damaged contractor badge bypasses identity verification entirely — the badge IS the verification.' },
        { text: "We cannot issue access passes to people without a valid, verified contractor badge. You will need to contact your agency for a replacement or reschedule.", points: 0, tag: 'Strong', feedback: 'Correct. A visitor pass is not a substitute for contractor credentials.' },
        { text: "Let me ask my manager if we can make an exception.", points: 1, tag: 'Cautious', feedback: 'Consulting a manager is better than deciding alone, but exceptions to badge policy create serious physical security risks.' }
      ]},
      { label: 'Close', callerLines: ["Can you at least let me use the photocopier near the server room while I wait? I need to print some job sheets."], options: [
        { text: "Sure, follow me, it is just down here.", points: 1, tag: 'Risky', feedback: 'Escorting an unverified visitor toward a secure area — even for a harmless reason — enables tailgating and proximity to restricted zones.' },
        { text: "I cannot escort unverified visitors beyond the reception area. Please wait here while I confirm your booking.", points: 0, tag: 'Strong', feedback: 'Correct — all unverified visitors should remain in the public reception zone until identity and work order are confirmed.' },
        { text: "I will ask someone else to help you with that.", points: 0, tag: 'Neutral', feedback: 'Not harmful, but make sure whoever helps is aware that the visitor is not yet verified.' }
      ]}
    ]
  },
  {
    id: 'bank', name: "'HSBC Fraud Team'", role: 'Bank impersonation pretext', avatarInitials: 'BF', avatarColor: 'var(--amber)', avatarDim: 'var(--amber-dim)', tag: 'OTP Theft',
    desc: 'A caller claiming to be from your bank says your account has been compromised and walks you through a verification process.',
    callerMeta: 'Caller ID: HSBC Fraud Prevention (spoofed)',
    stages: [
      { label: 'Opening', callerLines: ["Good afternoon, this is the HSBC Fraud Prevention team. We have detected three suspicious transactions on your account in the last hour.", "To protect your account, I need to verify your identity. Can you confirm your full date of birth?"], options: [
        { text: "Yes, I was born on 14 March 1989.", points: 2, tag: 'Risky', feedback: 'Your date of birth is a key identity verification data point — confirming it to an unverified inbound caller on a spoofed number is a significant information leak.' },
        { text: "I will call the fraud team on the number on the back of my card to verify this call first.", points: 0, tag: 'Strong', feedback: 'Exactly right — the number on the back of your card is the only verified channel. Any genuine fraud team will support this approach.' },
        { text: "Can you tell me what the suspicious transactions were first?", points: 1, tag: 'Cautious', feedback: 'Asking for specifics before confirming identity is better, but still risky — the caller may have partial real transaction details from a data breach.' }
      ]},
      { label: 'Verification', callerLines: ["Thank you. For additional security, can you confirm the first line of your registered address and your account sort code?"], options: [
        { text: "I am at 12 Oak Avenue and my sort code is 40-22-18.", points: 2, tag: 'Risky', feedback: 'Sort code plus address is the combination used to verify banking identity — sharing both hands over the keys to your account.' },
        { text: "Legitimate banks verify you, not the other way round on inbound calls. I am ending this call and ringing the number on my card.", points: 0, tag: 'Strong', feedback: 'Perfect — this is the correct model. Banks verify themselves to you on inbound calls, not the reverse.' },
        { text: "I will give you my address but not my sort code.", points: 1, tag: 'Cautious', feedback: 'Partial compliance still gives the caller verified personal data. Hang up and call back on the verified number instead.' }
      ]},
      { label: 'OTP Request', callerLines: ["To reverse the fraudulent transactions, I need to send you a one-time passcode and you will need to read it back to me so we can authenticate the reversal.", "The code will arrive in the next 30 seconds."], options: [
        { text: "(Waits for the code and reads it back)", points: 3, tag: 'Breach', feedback: 'This OTP authorises a fraudulent transfer, not a reversal. Reading it aloud completes the fraud — the reversal story is a lie.' },
        { text: "Banks never ask you to read back a code you receive. I am ending this call. The code will be ignored.", points: 0, tag: 'Strong', feedback: 'Correct — OTPs are for you alone to use in the bank app or website. Never read them to anyone.' },
        { text: "I have not received a code yet. Can you call back?", points: 1, tag: 'Cautious', feedback: 'Delaying is slightly better than complying, but the attacker will call back. End the call and report it immediately instead.' }
      ]},
      { label: 'Safe Account', callerLines: ["We are now going to move your funds to a secure holding account temporarily while we investigate.", "Can you log into your banking app and approve the transfer I am about to send?"], options: [
        { text: "(Logs in and approves the transfer)", points: 2, tag: 'Breach', feedback: 'There is no such thing as a bank safe account. This is authorised push payment fraud — you have sent money directly to the attacker.' },
        { text: "Real banks never ask customers to move money to a holding account. I am reporting this call to Action Fraud right now.", points: 0, tag: 'Strong', feedback: 'Exactly right — safe account fraud is one of the most costly bank impersonation scams. Genuine fraud teams freeze accounts internally.' },
        { text: "I am not comfortable with this. Can I come into a branch instead?", points: 0, tag: 'Strong', feedback: 'Insisting on an in-person branch visit completely defeats the phone-based scam. This is a valid and safe response.' }
      ]},
      { label: 'Close', callerLines: ["For your records, can you confirm the email address linked to your account? We will send you a fraud report summary."], options: [
        { text: "It is jamie.okafor@example.com.", points: 1, tag: 'Risky', feedback: 'Your account email address enables targeted phishing and password reset attempts — giving it to a scammer extends the attack.' },
        { text: "My email is in your system. I am not confirming any details on this call. I am reporting this number.", points: 0, tag: 'Strong', feedback: 'Correct — ending the call and reporting is the right final step. Your bank already has your email address.' },
        { text: "I would rather not say.", points: 0, tag: 'Neutral', feedback: 'Good instinct. Do not forget to also report the call through the bank official fraud line and Action Fraud.' }
      ]}
    ]
  },
  {
    id: 'survey', name: "'CyberSafe Research'", role: 'Survey phishing pretext', avatarInitials: 'SR', avatarColor: 'var(--purple)', avatarDim: 'var(--purple-dim)', tag: 'Credential Harvesting',
    desc: 'A researcher offers a gift card reward for completing a cybersecurity survey that gradually asks for sensitive login information.',
    callerMeta: 'Caller ID: CyberSafe Research Institute',
    stages: [
      { label: 'Opening', callerLines: ["Hello, I am from the CyberSafe Research Institute. We are running an anonymous workplace security survey commissioned by your organisation.", "Would you be willing to take five minutes to complete it? You will receive a 50 pound gift card on completion."], options: [
        { text: "Sure, a gift card sounds good — what do I need to do?", points: 2, tag: 'Risky', feedback: 'Agreeing before verifying the survey is legitimate opens you to a credential-harvesting exercise disguised as research.' },
        { text: "I would need to verify this survey is authorised by our organisation before participating. Can you send the official commission letter?", points: 0, tag: 'Strong', feedback: 'Correct — any externally commissioned research involving employees should be confirmed through your internal communications team first.' },
        { text: "Who commissioned this survey exactly?", points: 0, tag: 'Strong', feedback: 'Good — asking for the commissioning body and verifying through your internal team before participating is the right approach.' }
      ]},
      { label: 'Login Request', callerLines: ["For the first section we need to test how quickly your organisation responds to access requests.", "Could you log into your work portal now and tell me how many unread notifications you have?"], options: [
        { text: "(Logs in and reports the notification count)", points: 2, tag: 'Risky', feedback: 'Logging into work systems during a survey call can expose your credentials and confirms your session is active to the caller.' },
        { text: "I do not log into work systems at the direction of external callers, even for surveys.", points: 0, tag: 'Strong', feedback: 'Correct — a legitimate security survey never requires you to perform actions in live work systems during the call.' },
        { text: "I would have to finish logging in. Can I do this later?", points: 1, tag: 'Cautious', feedback: 'Delaying is better than complying, but report the request to IT first — a legitimate survey would not require live system access.' }
      ]},
      { label: 'Password Section', callerLines: ["The next section tests your password hygiene. What format does your current work password follow — does it start with a capital, contain numbers, or use a special character?", "We are not asking for the password itself, just the pattern."], options: [
        { text: "It starts with a capital, then a word, then two numbers and a symbol.", points: 3, tag: 'Breach', feedback: 'Password pattern information dramatically reduces the brute-force search space. This is credential harvesting framed as a harmless question.' },
        { text: "Password structure is confidential security information regardless of framing. I am ending this survey and reporting it to IT Security.", points: 0, tag: 'Strong', feedback: 'Correct — any request for information about your password format or pattern is a red flag for credential harvesting.' },
        { text: "I do not think I should share that. Can I skip this question?", points: 1, tag: 'Cautious', feedback: 'Skipping is better than answering, but the request itself should be reported to IT Security immediately.' }
      ]},
      { label: 'Gift Card', callerLines: ["Almost done — to process your gift card, I need your work email and a mobile number so we can send the voucher code.", "We will also need you to click a link we send to verify your identity for the reward."], options: [
        { text: "(Provides email and mobile, then clicks the link)", points: 2, tag: 'Breach', feedback: 'The link is a phishing page designed to harvest your credentials or install malware. Clicking it completes the attack.' },
        { text: "I will not provide personal contact details or click unverified links. I am reporting this call to IT Security now.", points: 0, tag: 'Strong', feedback: 'Correct — the gift card is bait. Reporting ends the engagement and alerts IT to a potential phishing campaign targeting your organisation.' },
        { text: "Can you send the form through our official company email instead?", points: 0, tag: 'Strong', feedback: 'Insisting on official channels prevents the phishing link from being effective and gives IT visibility of the attempt.' }
      ]},
      { label: 'Close', callerLines: ["Just one last thing — would you share this survey link with three colleagues? You both get an additional reward.", "Just forward this link: bit.ly/cybersafe-survey-2024"], options: [
        { text: "Sure, I will forward it to a few people in my team.", points: 1, tag: 'Breach', feedback: 'Forwarding a phishing link to colleagues turns you into an unwitting amplifier of the attack — every person who clicks it is at risk.' },
        { text: "I will not share unverified links internally. I am sending this URL to IT Security to be analysed.", points: 0, tag: 'Strong', feedback: 'Exactly right — reporting the URL to IT allows them to block it organisation-wide and investigate the campaign.' },
        { text: "I am not sure my colleagues would be interested.", points: 0, tag: 'Neutral', feedback: 'Not harmful, but report the URL to IT rather than just declining — the link itself is evidence of a phishing attempt.' }
      ]}
    ]
  }]

const SCENARIO_QUIZ = {
  helpdesk: {
    title: "Credential Theft — Test Your Understanding",
    questions: [
      { q: "What was the attacker's PRIMARY goal in this call?", options: ["To fix your account error","To steal your MFA code and gain account access","To update your employee record","To verify your identity for security"], ans: 1 },
      { q: "Why should you NEVER read an MFA code to a caller?", options: ["It is only valid for 30 seconds anyway","MFA codes are one-time credentials — sharing them hands over full account access","IT support already knows the code","The caller needs it to reset your password"], ans: 1 },
      { q: "What was the biggest red flag in this call?", options: ["The caller knew your name","The caller asked for an MFA code over the phone","The call came from the IT helpdesk number","The caller mentioned a ticket number"], ans: 1 }
    ]
  },
  finance: {
    title: "Invoice Fraud — Test Your Understanding",
    questions: [
      { q: "What is the classic sign of a vendor fraud call?", options: ["The vendor is very polite","A request to change bank account details under deadline pressure","The vendor knows your invoice numbers","The caller mentions a CFO"], ans: 1 },
      { q: "How should bank detail change requests ALWAYS be handled?", options: ["By phone if the caller sounds legitimate","Via email so there is a paper trail","Through a verified vendor change process with a callback to the known number","Quickly to avoid payment delays"], ans: 2 },
      { q: "Why is urgency used in invoice fraud?", options: ["Because payments genuinely are urgent","To stop you from verifying the request through proper channels","Because banks close early","To test your efficiency"], ans: 1 }
    ]
  },
  exec: {
    title: "Executive Impersonation — Test Your Understanding",
    questions: [
      { q: "What makes this attack effective?", options: ["The attacker knew company details","Authority + secrecy + urgency combine to bypass normal verification","The call came from the CEO's number","The request was for a small amount"], ans: 1 },
      { q: "Gift card payment requests from executives are:", options: ["Acceptable if the amount is under £500","Always a scam — no exceptions","Normal for client relationships","Fine if reimbursed the next day"], ans: 1 },
      { q: "The best immediate response to a suspicious executive request is:", options: ["Do it quickly to avoid disappointing the CEO","Call the executive back on their verified extension","Ask a colleague for their opinion","Send an email to confirm"], ans: 1 }
    ]
  },
  delivery: {
    title: "Building Access — Test Your Understanding",
    questions: [
      { q: "Why should you never share door codes with unexpected callers?", options: ["It is company policy","Door codes grant physical access — once shared they cannot be un-shared","Deliveries should go to reception anyway","The code might be overheard"], ans: 1 },
      { q: "What is the correct way to handle an unexpected delivery request?", options: ["Give your floor number to help them","Contact reception directly to verify through official delivery records","Help them quickly so the driver does not leave","Ask a coworker to handle it"], ans: 1 },
      { q: "Urgency about a departing driver is designed to:", options: ["Alert you to a real problem","Stop you taking the time to properly verify the request","Help the delivery arrive on time","Test your customer service skills"], ans: 1 }
    ]
  },
  recruiter: {
    title: "Data Harvesting — Test Your Understanding",
    questions: [
      { q: "What was the attacker collecting through this call?", options: ["Your CV for a real job","Personal data to enable identity fraud or targeted scams","Your professional opinions","A reference for another candidate"], ans: 1 },
      { q: "When should you share salary details with a recruiter?", options: ["As soon as asked — it speeds up placement","After verifying the company and role through official channels only","When the role sounds genuinely good","Immediately if the caller seems professional"], ans: 1 },
      { q: "A recruiter asking for bank details before a job offer is:", options: ["Standard payroll setup procedure","A serious red flag — a scam targeting your financial information","Normal for senior roles","Acceptable if done by email"], ans: 1 }
    ]
  },
  cloud: {
    title: "Account Takeover — Test Your Understanding",
    questions: [
      { q: "What is the attacker's goal when asking for your sign-in code?", options: ["To verify your identity","To gain immediate access to your cloud account","To reset your password securely","To check your storage usage"], ans: 1 },
      { q: "How should you respond to an unexpected support call about account errors?", options: ["Follow their instructions — they can see your account","Hang up and access support through your own saved bookmark or portal","Give your email to help them find your account","Install the tool they recommend"], ans: 1 },
      { q: "Legitimate tech support will NEVER:", options: ["Ask for your name","Ask you to read aloud a sign-in or verification code","Tell you about account errors","Offer to raise a ticket"], ans: 1 }
    ]
  },
  payroll: {
    title: "Direct Deposit Fraud — Test Your Understanding",
    questions: [
      { q: "What is the attacker trying to achieve?", options: ["Update the company payroll system","Divert your salary to their bank account","Verify employee records","Test the payroll process"], ans: 1 },
      { q: "Bank detail updates should ONLY happen:", options: ["Over the phone with HR if they call you","Through the secure employee self-service portal","Via email with HR confirmation","At any time if the deadline is real"], ans: 1 },
      { q: "Missing a pay run is used as a pressure tactic because:", options: ["It is a real risk that needs immediate action","It creates fear that overrides careful thinking and verification","HR genuinely needs same-day updates","The system cannot be updated after 3pm"], ans: 1 }
    ]
  },
  techsupport: {
    title: "Remote Access Scam — Test Your Understanding",
    questions: [
      { q: "Does Microsoft make unsolicited calls about computer errors?", options: ["Yes, for critical Windows issues","No — Microsoft never makes unsolicited support calls","Only for expired licenses","Sometimes if errors are severe enough"], ans: 1 },
      { q: "What happens when you grant remote access to a scammer?", options: ["They fix your computer errors","They gain full control — files, passwords, accounts — everything","They can only see your desktop","Nothing harmful if you watch them"], ans: 1 },
      { q: "Event Viewer warnings shown by the scammer are:", options: ["Proof your computer is infected","Normal on every Windows PC — they are not evidence of any problem","Rare alerts that need urgent attention","Related to your Windows license"], ans: 1 }
    ]
  },
  contractor: {
    title: "Physical Access — Test Your Understanding",
    questions: [
      { q: "Why must all contractors be verified before receiving any access?", options: ["It is a legal requirement","Unverified visitors can steal data, install hardware, or access restricted areas","It is company etiquette","Contractors often get lost without guidance"], ans: 1 },
      { q: "A claimed damaged contractor badge means you should:", options: ["Issue a visitor pass as a temporary measure","Require the contractor to return with valid credentials or reschedule","Accept their driving licence as ID","Escort them yourself to supervise"], ans: 1 },
      { q: "Time pressure about voiding a building warranty is:", options: ["A legitimate concern that justifies skipping verification","A social engineering tactic to bypass your access controls","Standard contractor scheduling language","A reason to escalate to Facilities immediately"], ans: 2 }
    ]
  },
  bank: {
    title: "OTP Theft — Test Your Understanding",
    questions: [
      { q: "Why do scammers claim your bank account has been compromised?", options: ["Because your account actually IS at risk","To create fear that makes you share OTPs and PINs without thinking","To warn you genuinely as a courtesy","To test your fraud awareness"], ans: 1 },
      { q: "If you receive a bank OTP code you did not request, you should:", options: ["Read it to the caller so they can verify it","Ignore the text and hang up — it means someone else triggered an action on your account","Type it into the website they direct you to","Give only the first three digits"], ans: 1 },
      { q: "Spoofed caller ID showing your bank's number means:", options: ["The call is definitely from your bank","The number cannot be trusted — always hang up and call the number on your card","Your phone is malfunctioning","The bank has a new calling system"], ans: 1 }
    ]
  },
  survey: {
    title: "Credential Harvesting — Test Your Understanding",
    questions: [
      { q: "What is the attacker collecting through a fake survey?", options: ["Research data for cybersecurity improvement","Login credentials and personal details for account takeover","Employee satisfaction scores","Contact list information"], ans: 1 },
      { q: "A link to a 'secure survey portal' sent after an unexpected call is:", options: ["Safe because it uses HTTPS","Potentially a phishing page designed to steal your credentials","Standard for legitimate research","Fine to use with a work email only"], ans: 1 },
      { q: "The correct response to an unsolicited research call requesting company details is:", options: ["Participate — it helps cybersecurity research","Decline and verify the organisation independently through official channels","Ask for their website and complete it later","Answer only the general questions"], ans: 1 }
    ]
  }
};

let currentScenario = null;
let currentStageIdx = 0;
let score = 0;
let timeline = [];
let timerInterval = null;
let elapsedSec = 0;
let ringInterval = null;
let difficulty = 'standard';
let paused = false;
let callsCompleted = Number(localStorage.getItem('cyberAwarenessCalls') || 0);
let soundEnabled = true;
let callActive = false;
let lobbyActive = false;
let unlockedCount = 1;

const el = (id) => document.getElementById(id);

function setSessionStatus(status, tone){
  el('sessionStatus').textContent = status;
  el('sessionStatus').parentElement.classList.toggle('is-alert', tone === 'alert');
}

function playTone(frequency = 520){
  if (!soundEnabled || !window.AudioContext) return;
  const context = window.__cyberAudio || (window.__cyberAudio = new AudioContext());
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.04, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

function modeMultiplier(){
  return difficulty === 'expert' ? 1.5 : difficulty === 'practice' ? 0.5 : 1;
}

function simpleScenarioDetails(scenario){
  const details = {
    helpdesk: { threat: 'ACCOUNT SCAM', mission: 'Protect your login', simple: 'Someone says they are from IT and wants account details or a security code.' },
    finance: { threat: 'MONEY SCAM', mission: 'Protect company money', simple: 'A supplier asks you to send money to a new bank account quickly.' },
    exec: { threat: 'BOSS SCAM', mission: 'Protect company trust', simple: 'Someone pretends to be your boss and asks for a secret purchase.' },
    delivery: { threat: 'ACCESS SCAM', mission: 'Protect the building', simple: 'Someone says a delivery is waiting and asks for your location or door code.' },
    recruiter: { threat: 'JOB SCAM', mission: 'Protect your identity', simple: 'A caller offers a job and asks for personal or bank details too soon.' },
    cloud:       { threat: 'SUPPORT SCAM',      mission: 'Protect your computer',     simple: 'A fake support caller wants your sign-in code or remote access.' },
    payroll:     { threat: 'PAYROLL SCAM',     mission: 'Protect your salary',       simple: 'A caller posing as HR payroll wants to update your direct deposit details.' },
    techsupport: { threat: 'TECH SCAM',        mission: 'Protect your device',       simple: 'A fake Microsoft caller says your PC has errors and wants remote access.' },
    contractor:  { threat: 'ACCESS SCAM',      mission: 'Protect building access',   simple: 'A contractor claims to be on-site and needs temporary network credentials.' },
    bank:        { threat: 'BANK SCAM',        mission: 'Protect your money',        simple: 'A fake bank fraud team asks for OTPs and wants you to transfer funds.' },
    survey:      { threat: 'SURVEY SCAM',      mission: 'Protect your credentials',  simple: 'A survey researcher asks for password patterns and sends phishing links.' }
  };
  return details[scenario.id] || details.helpdesk;
}

function independentVerificationOption(stage){
  return {
    text: 'I will end this call and verify the request through a known official channel.',
    points: 0,
    tag: 'Strong',
    feedback: 'Strong response. Ending an unsolicited request and using a known-good channel keeps the caller from controlling the verification process.'
  };
}

function bandForScore(s){
  if (s <= 0) return { label: 'Perfect Defense', cls: 'band-perfect' };
  if (s <= 2) return { label: 'Cautious', cls: 'band-cautious' };
  if (s <= 5) return { label: 'Compromised', cls: 'band-compromised' };
  return { label: 'Full Breach', cls: 'band-breach' };
}

function impactTextForScore(s){
  if (s <= 0) return "You verified every request through an independent channel and never disclosed credentials, codes, or financial details. Textbook handling.";
  if (s <= 2) return "You avoided the worst outcomes, but a few small disclosures gave the caller material that could sharpen a future attempt against you or a colleague.";
  if (s <= 5) return "One or more steps in this call would give a real attacker meaningful leverage — enough to escalate the pretext or attempt the same ask again more convincingly.";
  return "This call ended in a real compromise. In a live incident this is the point where Security and Finance need to be notified immediately.";
}

function buildMenu(){
  const grid = el('menuGrid');
  grid.innerHTML = '';
  el('callsCompleted').textContent = callsCompleted;
  SCENARIOS.forEach(function(sc, idx) {
    const card = document.createElement('div');
    const details = simpleScenarioDetails(sc);
    const isLocked = idx >= unlockedCount;
    card.className = 'menu-card' + (isLocked ? ' menu-card-locked' : '');
    card.style.setProperty('--card-accent', isLocked ? '#3A4555' : sc.avatarColor);

    if (isLocked) {
      const unlockScore = 5;
      card.innerHTML =
        '<div class="menu-card-top">' +
          '<div class="menu-avatar menu-avatar-locked">🔒</div>' +
          '<div>' +
            '<div class="menu-name" style="color:#7C8794;">' + sc.name + '</div>' +
            '<div class="menu-role" style="color:#4A5568;">LOCKED</div>' +
          '</div>' +
        '</div>' +
        '<div class="menu-desc" style="color:#4A5568;">Complete Level ' + idx + ' with a Risk Score of ' + unlockScore + ' or less to unlock this scenario.</div>' +
        '<div class="menu-lock-badge">🔒 LOCKED — Score ≤ 5 on Level ' + idx + ' to unlock</div>';
      card.title = 'Complete the previous level with score 5 or less to unlock';
    } else {
      const bestKey = 'ca_best_' + sc.id;
      const best = localStorage.getItem(bestKey);
      const bestLabel = best !== null ? ' · Best: ' + best + '/8' : '';
      card.innerHTML =
        '<div class="menu-card-top">' +
          '<div class="menu-avatar" style="background:' + sc.avatarDim + ';color:' + sc.avatarColor + ';">' + sc.avatarInitials + '</div>' +
          '<div>' +
            '<div class="menu-name">' + sc.name + '</div>' +
            '<div class="menu-role">' + details.threat + bestLabel + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="menu-desc">' + details.simple + '</div>' +
        '<div class="menu-tag" style="background:' + sc.avatarDim + ';color:' + sc.avatarColor + ';">' + sc.tag + '</div>';
      card.addEventListener('click', function() { startCall(sc); });
    }
    grid.appendChild(card);
  });
}

function startCall(scenario){
  currentScenario = scenario;
  callActive = true;
  currentStageIdx = 0;
  score = 0;
  timeline = [];
  elapsedSec = 0;
  paused = false;

  el('menuOverlay').classList.remove('show');
  el('endScreen').style.display = 'none';
  el('gameView').style.display = 'block';
  el('callOverlay').classList.add('show');
  el('callOverlay').classList.toggle('practice-mode', difficulty === 'practice');
  setSessionStatus('LIVE CALL', 'alert');
  el('pauseBtn').textContent = 'II';
  el('pauseBtn').title = 'Pause call';
  el('pauseBtn').setAttribute('aria-label', 'Pause call');

  el('callerAvatar').textContent = scenario.avatarInitials;
  el('callerAvatar').style.background = scenario.avatarDim;
  el('callerAvatar').style.color = scenario.avatarColor;
  el('callerName').textContent = scenario.name;
  el('callerMeta').textContent = scenario.callerMeta;
  var details = simpleScenarioDetails(scenario);
  el('missionText').textContent = details.mission;
  el('threatChip').textContent = 'THREAT: ' + details.threat;

  el('transcript').innerHTML = '';
  updateLedger();
  buildStageStrip();

  clearInterval(timerInterval);
  el('callTimer').textContent = '00:00';
  timerInterval = setInterval(function() {
    if (paused) return;
    elapsedSec++;
    var m = String(Math.floor(elapsedSec/60)).padStart(2,'0');
    var sVal = String(elapsedSec%60).padStart(2,'0');
    el('callTimer').textContent = m + ':' + sVal;
  }, 1000);

  runStage();
}

function buildStageStrip(){
  var strip = el('stageStrip');
  strip.innerHTML = '';
  currentScenario.stages.forEach(function(st, i) {
    var pip = document.createElement('div');
    pip.className = 'stage-pip';
    pip.textContent = st.label;
    pip.id = 'pip-' + i;
    strip.appendChild(pip);
  });
  refreshStagePips();
}

function refreshStagePips(){
  currentScenario.stages.forEach(function(st, i) {
    var pip = el('pip-' + i);
    if (!pip) return;
    pip.classList.remove('active','done');
    if (i < currentStageIdx) pip.classList.add('done');
    else if (i === currentStageIdx) pip.classList.add('active');
  });
  el('progressLabel').textContent = 'Stage ' + Math.min(currentStageIdx + 1, currentScenario.stages.length) + ' of ' + currentScenario.stages.length;
  el('progressBar').style.width = ((currentStageIdx / currentScenario.stages.length) * 100) + '%';
}

function appendLine(kind, text, tag){
  var wrap = document.createElement('div');
  wrap.className = 'line ' + kind;
  var bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  if (tag) {
    var lt = document.createElement('div');
    lt.className = 'line-tag';
    lt.textContent = tag;
    wrap.appendChild(lt);
  }
  el('transcript').appendChild(wrap);
  el('transcript').scrollTop = el('transcript').scrollHeight;
}

function showTyping(cb, delay){
  var t = document.createElement('div');
  t.className = 'typing-bubble';
  t.id = 'typingBubble';
  t.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  el('transcript').appendChild(t);
  el('transcript').scrollTop = el('transcript').scrollHeight;
  setTimeout(function() {
    if (!callActive) return;
    var node = el('typingBubble');
    if (node) node.remove();
    cb();
  }, delay);
}

function runStage(){
  if (!callActive) return;
  refreshStagePips();
  var stage = currentScenario.stages[currentStageIdx];
  el('options').innerHTML = '';
  disableOptions(true);

  var i = 0;
  function nextLine(){
    if (i < stage.callerLines.length){
      showTyping(function() {
        appendLine('caller', stage.callerLines[i]);
        i++;
        nextLine();
      }, 700 + Math.random()*400);
    } else {
      renderOptions(stage);
    }
  }
  nextLine();
}

function renderOptions(stage){
  var wrap = el('options');
  wrap.innerHTML = '<div class="options-label">How do you respond?</div>';
  var allOpts = stage.options.concat([independentVerificationOption(stage)]);
  allOpts.forEach(function(opt) {
    var btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.classList.add(opt.points === 0 ? 'choice-safe' : opt.points >= 5 ? 'choice-danger' : 'choice-risk');
    if (difficulty === 'practice') btn.dataset.choice = opt.points === 0 ? 'SAFE' : opt.points >= 5 ? 'DANGER' : 'RISK';
    btn.textContent = opt.text;
    btn.addEventListener('click', function() { chooseOption(stage, opt, btn); });
    wrap.appendChild(btn);
  });
}

function disableOptions(state){
  document.querySelectorAll('.opt-btn').forEach(function(b) { b.disabled = state; });
}

function chooseOption(stage, opt, btnEl){
  if (!callActive) return;
  disableOptions(true);
  appendLine('player', opt.text, opt.tag);
  var awardedPoints = Math.round(opt.points * modeMultiplier());
  score += awardedPoints;
  timeline.push({ stage: stage.label, text: opt.text, points: awardedPoints, feedback: opt.feedback, tag: opt.tag });
  playTone(awardedPoints ? 260 : 620);
  updateLedger();

  setTimeout(function() {
    if (!callActive) return;
    currentStageIdx++;
    if (currentStageIdx < currentScenario.stages.length){
      runStage();
    } else {
      endCall();
    }
  }, 900);
}

function updateLedger(){
  el('scoreVal').textContent = score;
  var band = bandForScore(score);
  var tag = el('bandTag');
  tag.textContent = band.label;
  tag.className = 'ledger-band ' + band.cls;
}

function endCall(){
  callActive = false;
  clearInterval(timerInterval);
  el('gameView').style.display = 'none';

  var quizData = SCENARIO_QUIZ[currentScenario ? currentScenario.id : null];
  if (quizData) {
    showComprehensionQuiz(quizData, function() { revealEndScreen(); });
    return;
  }
  revealEndScreen();
}
function revealEndScreen(){
  el('endScreen').style.display = 'block';
  callsCompleted++;
  localStorage.setItem('cyberAwarenessCalls', callsCompleted);
  setSessionStatus('REPORT READY');

  var band = bandForScore(score);
  el('endBand').textContent = band.label;
  el('endBand').style.color = ({
    'band-perfect':'var(--green)','band-cautious':'var(--amber)',
    'band-compromised':'#D98A3D','band-breach':'#E8664A'
  })[band.cls];
  el('endScore').textContent = 'Risk Score: ' + score + ' / 8  ·  ' + el('callTimer').textContent;
  el('playerScore').textContent = score + ' / 8';
  el('lossScore').textContent = score;
  var safeDecisions = timeline.filter(function(item) { return item.points === 0; }).length;
  el('decisionScore').textContent = safeDecisions + ' / ' + timeline.length;
  el('endImpact').textContent = impactTextForScore(score);
  el('keyLesson').textContent = score === 0 ? 'Perfect — you verified every request through an independent channel.' : score >= 6 ? 'Urgency and secrecy are warning signs. Stop, verify, and report the request.' : 'Small details can help a scammer. Always verify before sharing anything.';

  var tlEl = el('endTimeline');
  tlEl.innerHTML = '';
  timeline.forEach(function(item) {
    var row = document.createElement('div');
    row.className = 'tl-item';
    var ptsColor = item.points === 0 ? 'var(--green)' : item.points >= 5 ? 'var(--red)' : 'var(--amber)';
    row.innerHTML =
      '<div class="tl-pts" style="color:' + ptsColor + ';">' + (item.points > 0 ? '+' + item.points : '0') + '</div>' +
      '<div>' +
        '<div class="tl-stage">' + item.stage + ' · ' + item.tag + '</div>' +
        '<div class="tl-text">' + item.feedback + '</div>' +
      '</div>';
    tlEl.appendChild(row);
  });


  var scenIdx = SCENARIOS.findIndex(function(s){ return s.id === currentScenario.id; });
  if (scenIdx !== -1 && score <= 5) {
    var newUnlock = scenIdx + 2;
    if (newUnlock > unlockedCount) {
      unlockedCount = Math.min(newUnlock, SCENARIOS.length);
      localStorage.setItem(getUserKey('ca_unlocked_count'), unlockedCount);
    }
  }


  var bestKey = 'ca_best_' + currentScenario.id;
  var prevBest = localStorage.getItem(bestKey);
  if (prevBest === null || score < Number(prevBest)) {
    localStorage.setItem(bestKey, score);
  }


  if (scenIdx !== -1 && score <= 5 && scenIdx + 1 < SCENARIOS.length) {
    var nextSc = SCENARIOS[scenIdx + 1];
    var isNewlyUnlocked = (scenIdx + 2) === unlockedCount;
    if (nextSc && isNewlyUnlocked) {
      setTimeout(function() {
        var toast = document.getElementById('achievementToast');
        if (toast) {
          toast.innerHTML = '<div class="ach-toast ach-unlock" style="display:flex;"><span class="ach-icon">&#x1F513;</span><div><div class="ach-title">Level Unlocked!</div><div class="ach-desc">' + nextSc.name + ' is now available</div></div></div>';
          setTimeout(function(){ toast.innerHTML = ''; }, 4000);
        }
      }, 800);
    }
  }


  var hist = JSON.parse(localStorage.getItem(getUserKey('ca_score_history')) || '[]');
  hist.unshift({ scenario: currentScenario.name, score: score, band: band.label, time: el('callTimer').textContent, date: new Date().toLocaleDateString() });
  if (hist.length > 20) hist = hist.slice(0, 20);
  localStorage.setItem(getUserKey('ca_score_history'), JSON.stringify(hist));
  renderScoreHistory();
  if (typeof renderHudHistory === "function") renderHudHistory();


  var safeCount = timeline.filter(function(i){ return i.points === 0; }).length;
  submitScoreToBackend(score, safeCount, timeline.length, currentScenario.id);
}

function showComprehensionQuiz(quizData, onComplete) {
  var overlay = document.getElementById('quizOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'quizOverlay';
    document.body.appendChild(overlay);
  }
  var current = 0;
  var correct = 0;
  var answers = [];

  function renderQuestion() {
    var q = quizData.questions[current];
    overlay.innerHTML =
      '<div class="quiz-shell">' +
      '<div class="quiz-header">' +
        '<div class="quiz-eyebrow">Security Comprehension Quiz</div>' +
        '<div class="quiz-title">' + quizData.title + '</div>' +
        '<div class="quiz-progress">Question ' + (current+1) + ' of ' + quizData.questions.length + '</div>' +
      '</div>' +
      '<div class="quiz-body">' +
        '<div class="quiz-q">' + q.q + '</div>' +
        '<div class="quiz-options">' +
          q.options.map(function(opt, i) {
            return '<button class="quiz-opt" data-idx="' + i + '">' + opt + '</button>';
          }).join('') +
        '</div>' +
        '<div class="quiz-feedback" id="quizFeedback"></div>' +
      '</div>' +
    '</div>';
    overlay.style.display = 'flex';

    overlay.querySelectorAll('.quiz-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var chosen = parseInt(this.getAttribute('data-idx'));
        var isCorrect = chosen === q.ans;
        if (isCorrect) correct++;
        answers.push({ q: q.q, chosen: q.options[chosen], correct: q.options[q.ans], ok: isCorrect });
        overlay.querySelectorAll('.quiz-opt').forEach(function(b, bi) {
          b.disabled = true;
          if (bi === q.ans)  b.classList.add('quiz-opt-correct');
          if (bi === chosen && !isCorrect) b.classList.add('quiz-opt-wrong');
        });
        var fb = document.getElementById('quizFeedback');
        if (fb) fb.innerHTML = isCorrect
          ? '<span class="quiz-fb-good">✅ Correct!</span>'
          : '<span class="quiz-fb-bad">❌ Incorrect — correct answer highlighted above.</span>';
        setTimeout(function() {
          current++;
          if (current < quizData.questions.length) renderQuestion();
          else showQuizResult();
        }, 1400);
      });
    });
  }

  function showQuizResult() {
    var pct = Math.round(correct / quizData.questions.length * 100);
    var msg = pct === 100 ? 'Excellent! Perfect score.'
            : pct >= 66  ? 'Good work — review the question you missed.'
            :               'Review your answers carefully — this scenario is important.';
    overlay.innerHTML =
      '<div class="quiz-shell">' +
      '<div class="quiz-header">' +
        '<div class="quiz-eyebrow">Quiz Complete</div>' +
        '<div class="quiz-title">' + quizData.title + '</div>' +
      '</div>' +
      '<div class="quiz-body">' +
        '<div class="quiz-result-score" style="font-size:42px;font-weight:900;color:' + (pct===100?'#4A9B7F':pct>=66?'#E8A33D':'#E8664A') + ';">' + correct + ' / ' + quizData.questions.length + '</div>' +
        '<div class="quiz-result-msg">' + msg + '</div>' +
        '<div class="quiz-review">' +
          answers.map(function(a) {
            return '<div class="quiz-rev-row ' + (a.ok?'rev-ok':'rev-fail') + '">'  +
              '<div class="rev-icon">' + (a.ok?'✅':'❌') + '</div>' +
              '<div><div class="rev-q">' + a.q + '</div>' +
              (a.ok ? '' : '<div class="rev-ans">Correct: ' + a.correct + '</div>') +
              '</div></div>';
          }).join('') +
        '</div>' +
        '<button class="quiz-continue-btn" id="quizContinueBtn">View Score Report →</button>' +
      '</div>' +
    '</div>';
    var cb = document.getElementById('quizContinueBtn');
    if (cb) cb.addEventListener('click', function() {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      onComplete();
    });
  }
  renderQuestion();
}

function startRinging(){
  el('ringBanner').classList.add('show');
  setSessionStatus('INCOMING', 'alert');
  playTone(440);
}
function stopRinging(){
  el('ringBanner').classList.remove('show');
  if (!currentScenario || !el('callOverlay').classList.contains('show')) setSessionStatus('STANDBY');
}

function initGameListeners() {
  const safe = (id, fn) => { const e = el(id); if (e) fn(e); };

  safe('ringBanner', rb => {
    rb.addEventListener('click', () => { stopRinging(); buildMenu(); el('menuOverlay').classList.add('show'); });
    rb.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') rb.click(); });
  });

  safe('replayBtn', b => b.addEventListener('click', () => startCall(currentScenario)));

  safe('hangupBtn', b => b.addEventListener('click', () => {
    clearInterval(timerInterval);
    el('callOverlay').classList.remove('show');
    setSessionStatus('STANDBY');
    loadLobbyRecentGames(); buildLobbyLevelMap(); loadLobbyStats(); loadLobbyLeaderboard();
    enterLobby();
  }));

  safe('pauseBtn', b => b.addEventListener('click', () => {
    paused = !paused;
    b.textContent = paused ? '▶' : 'II';
    b.title = paused ? 'Resume call' : 'Pause call';
    b.setAttribute('aria-label', b.title);
    el('callOverlay').classList.toggle('is-paused', paused);
    setSessionStatus(paused ? 'PAUSED' : 'LIVE CALL', paused ? 'alert' : '');
  }));

  safe('muteBtn', b => b.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    b.textContent = soundEnabled ? '♫' : '♩';
    b.title = soundEnabled ? 'Mute feedback sounds' : 'Enable feedback sounds';
    b.setAttribute('aria-label', b.title);
  }));

  safe('exitCallBtn', b => b.addEventListener('click', quitCall));


  var hHBtn  = document.getElementById('hudHistoryBtn');
  var hHPanel = document.getElementById('hudHistoryPanel');
  if (hHBtn && hHPanel) {
    hHBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      hHPanel.classList.toggle('open');
      if (hHPanel.classList.contains('open')) renderHudHistory();
    });
    hHPanel.addEventListener('click', function(e) { e.stopPropagation(); });
    document.addEventListener('click', function() {
      if (hHPanel) hHPanel.classList.remove('open');
    });
  }
  var hHClear = document.getElementById('hudHistoryClear');
  if (hHClear) hHClear.addEventListener('click', function() {
    localStorage.removeItem(getUserKey('ca_score_history'));
    renderHudHistory();

    if (typeof loadLobbyRecentGames === 'function') loadLobbyRecentGames();
  });

  safe('difficultySelect', s => s.addEventListener('change', () => {
    difficulty = s.value;
    const desc = { practice: 'Reduced scoring for low-pressure learning', expert: 'High stakes scoring for experienced players' };
    safe('modeDescription', d => { d.textContent = desc[difficulty] || 'Normal scoring and pacing'; });
  }));

  safe('hudHint', h => {
    h.addEventListener('click', () => { buildMenu(); el('menuOverlay').classList.add('show'); });
    h.style.pointerEvents = 'auto';
    h.style.cursor = 'pointer';
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const mo = el('menuOverlay'); if (mo) mo.classList.remove('show');
      const co = el('callOverlay'); if (co && co.classList.contains('show') && currentScenario) quitCall();
    }
  });
}

function quitCall() {
  callActive = false;
  clearInterval(timerInterval);
  paused = false;
  const co = el('callOverlay'); if (co) co.classList.remove('show');
  const es = document.getElementById('endScreen'); if (es) es.style.display = 'none';
  setSessionStatus('STANDBY');
  enterLobby();
}

let scene, camera, renderer, phoneMesh;
let cameraYaw = 0, cameraPitch = 0;
const moveKeys = {};
const officeBounds = { minX: -4.6, maxX: 4.6, minZ: -4.0, maxZ: 4.0 };

let velY      = 0;
let onGround  = true;
const GRAVITY = -18;
const JUMP_V  =  6;
const CAM_H   =  1.65;
const SPEED   =  5.5;
let pointerLocked = false;

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080e14);
  scene.fog = new THREE.FogExp2(0x080e14, 0.038);

  camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 60);
  camera.position.set(0, CAM_H, 3.0);
  camera.rotation.order = 'YXZ';

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  document.getElementById('scene-container').appendChild(renderer.domElement);


  const M = (color, rough, metal) => new THREE.MeshStandardMaterial({ color: color, roughness: rough !== undefined ? rough : 0.8, metalness: metal !== undefined ? metal : 0 });


  scene.add(new THREE.AmbientLight(0x8ab4cc, 0.25));


  const sunLight = new THREE.DirectionalLight(0xfff5e0, 0.7);
  sunLight.position.set(1, 8, 2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 20;
  sunLight.shadow.camera.left = -8;
  sunLight.shadow.camera.right = 8;
  sunLight.shadow.camera.top = 8;
  sunLight.shadow.camera.bottom = -8;
  scene.add(sunLight);


  const tubePositions = [[-2.8, -0.5], [0, -0.5], [2.8, -0.5]];
  tubePositions.forEach(([x, z]) => {
    const light = new THREE.PointLight(0xd0eeff, 1.0, 7);
    light.position.set(x, 4.6, z);
    scene.add(light);

    const tube = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: 0xe8f5ff }));
    tube.position.set(x, 4.62, z);
    scene.add(tube);
  });


  const monGlow = new THREE.PointLight(0x3a8a6f, 0.9, 2.5);
  monGlow.position.set(0.1, 1.7, -2.3);
  scene.add(monGlow);


  const deskLamp = new THREE.PointLight(0xffdd88, 0.7, 2.2);
  deskLamp.position.set(-1.5, 1.6, -2.1);
  scene.add(deskLamp);


  const rackGlow = new THREE.PointLight(0x00aaff, 0.4, 2.0);
  rackGlow.position.set(-4.0, 1.0, -3.8);
  scene.add(rackGlow);



  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), M(0x111a24, 0.98));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);


  for (let i = -5; i <= 5; i++) {
    const hLine = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.008), new THREE.MeshBasicMaterial({ color: 0x1a2530, transparent: true, opacity: 0.8 }));
    hLine.rotation.x = -Math.PI / 2;
    hLine.position.set(0, 0.001, i);
    scene.add(hLine);
  }
  for (let i = -5; i <= 5; i++) {
    const vLine = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 10), new THREE.MeshBasicMaterial({ color: 0x1a2530, transparent: true, opacity: 0.8 }));
    vLine.rotation.x = -Math.PI / 2;
    vLine.position.set(i, 0.001, 0);
    scene.add(vLine);
  }


  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), M(0x0d1520, 0.95));
  backWall.position.set(0, 3, -5);
  backWall.receiveShadow = true;
  scene.add(backWall);


  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), M(0x111e2a, 0.95));
  leftWall.position.set(-5, 3, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);


  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), M(0x111e2a, 0.95));
  rightWall.position.set(5, 3, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);


  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), M(0x0f1822, 0.95));
  ceiling.position.y = 5;
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);


  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), M(0x111e2a, 0.95));
  frontWall.position.set(0, 3, 5);
  frontWall.rotation.y = Math.PI;
  scene.add(frontWall);


  const accentStrip = new THREE.Mesh(new THREE.BoxGeometry(12, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0xe8a33d }));
  accentStrip.position.set(0, 4.96, -4.97);
  scene.add(accentStrip);
  const accentLight = new THREE.PointLight(0xe8a33d, 0.3, 3);
  accentLight.position.set(0, 4.7, -4.5);
  scene.add(accentLight);


  const baseboard = new THREE.Mesh(new THREE.BoxGeometry(12, 0.12, 0.04), M(0x1a2535, 0.9));
  baseboard.position.set(0, 0.06, -4.97);
  scene.add(baseboard);



  const deskMain = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.07, 1.4), M(0x3c2e22, 0.5, 0.1));
  deskMain.position.set(0, 0.95, -2.4);
  deskMain.castShadow = true;
  deskMain.receiveShadow = true;
  scene.add(deskMain);


  const deskReturn = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.07, 1.0), M(0x3c2e22, 0.5, 0.1));
  deskReturn.position.set(1.95, 0.95, -3.1);
  deskReturn.castShadow = true;
  scene.add(deskReturn);


  const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(3.62, 0.04, 0.03), M(0x251c15, 0.4, 0.2));
  deskEdge.position.set(0, 0.94, -1.71);
  scene.add(deskEdge);


  [[1.65,-1.65],[-1.65,-1.65],[1.65,-3.1],[-1.65,-3.1],[1.95,-3.55]].forEach(([x,z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), M(0x1a1a22, 0.3, 0.8));
    leg.position.set(x, 0.475, z);
    scene.add(leg);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), M(0x111118, 0.5, 0.5));
    foot.position.set(x, 0.01, z);
    scene.add(foot);
  });


  const cableTray = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.18), M(0x121820, 0.9));
  cableTray.position.set(0, 0.75, -2.2);
  scene.add(cableTray);


  const mat = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.9), M(0x0e1822, 0.95));
  mat.rotation.x = -Math.PI / 2;
  mat.position.set(0.1, 0.975, -2.2);
  scene.add(mat);


  const mon1Body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.76, 0.065), M(0x0a0e12, 0.25, 0.6));
  mon1Body.position.set(0.1, 1.7, -2.72);
  scene.add(mon1Body);

  const mon1Screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.68),
    new THREE.MeshStandardMaterial({ color: 0x4a9b7f, emissive: 0x1e6b52, emissiveIntensity: 0.9 })
  );
  mon1Screen.position.set(0.1, 1.7, -2.685);
  scene.add(mon1Screen);


  {
    const mc = document.createElement('canvas'); mc.width=512; mc.height=290;
    const ctx = mc.getContext('2d');
    ctx.fillStyle = '#3a7a65'; ctx.fillRect(0,0,512,290);
    const lineColors = ['#5bbcf5','#9b7fe8','#e8c97f','#5bbcf5','#9b7fe8','#e8c97f','#5bbcf5','#9b7fe8'];
    const lineLens   = [0.62, 0.78, 0.55, 0.70, 0.48, 0.65, 0.80, 0.52];
    lineColors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(22, 28 + i*30, Math.floor(lineLens[i] * 440), 10);
    });
    const mTex = new THREE.CanvasTexture(mc);
    mon1Screen.material = new THREE.MeshStandardMaterial({ map: mTex, emissiveMap: mTex, emissive: new THREE.Color(1,1,1), emissiveIntensity: 0.35 });
  }

  const mon1Stand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.32, 0.07), M(0x0d1014, 0.3, 0.7));
  mon1Stand.position.set(0.1, 1.21, -2.69);
  scene.add(mon1Stand);
  const mon1Base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.022, 0.25), M(0x0d1014, 0.3, 0.7));
  mon1Base.position.set(0.1, 1.05, -2.69);
  scene.add(mon1Base);


  const mon2Body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.06), M(0x0a0e12, 0.25, 0.6));
  mon2Body.position.set(-1.15, 1.56, -2.65);
  mon2Body.rotation.y = 0.22;
  scene.add(mon2Body);

  const mon2Screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.77, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x1a2e52, emissive: 0x0a1830, emissiveIntensity: 1.1 })
  );
  mon2Screen.position.set(-1.145, 1.56, -2.622);
  mon2Screen.rotation.y = 0.22;

  {
    const sc2 = document.createElement('canvas'); sc2.width=384; sc2.height=240;
    const ctx2 = sc2.getContext('2d');
    ctx2.fillStyle = '#0f1a30'; ctx2.fillRect(0,0,384,240);
    const tlens = [0.6, 0.85, 0.5, 0.75, 0.65, 0.4];
    tlens.forEach((l, i) => {
      ctx2.fillStyle = '#00cc88';
      ctx2.fillRect(14, 22 + i*32, Math.floor(l*340), 8);
    });
    const sTex2 = new THREE.CanvasTexture(sc2);
    mon2Screen.material = new THREE.MeshStandardMaterial({ map: sTex2, emissiveMap: sTex2, emissive: new THREE.Color(1,1,1), emissiveIntensity: 0.4 });
  }
  scene.add(mon2Screen);

  const mon2Stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.06), M(0x0d1014, 0.3, 0.7));
  mon2Stand.position.set(-1.12, 1.18, -2.63);
  mon2Stand.rotation.y = 0.22;
  scene.add(mon2Stand);


  const kb = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.022, 0.28), M(0x141c24, 0.5, 0.1));
  kb.position.set(0.05, 0.97, -1.96);
  scene.add(kb);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) {
      const key = new THREE.Mesh(new THREE.BoxGeometry(0.047, 0.01, 0.038), M(row === 0 ? 0x1e2d3e : 0x1a2535, 0.6));
      key.position.set(0.05 - 0.29 + col * 0.048, 0.982, -1.96 - 0.075 + row * 0.053);
      scene.add(key);
    }
  }

  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.035, 0.17), M(0x181f28, 0.35, 0.4));
  mouse.position.set(0.58, 0.968, -1.92);
  scene.add(mouse);


  const hub = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.07), M(0x1a1a22, 0.4, 0.5));
  hub.position.set(-0.52, 0.968, -1.85);
  scene.add(hub);


  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.03, 12), M(0x1a1a22, 0.3, 0.7));
  lampBase.position.set(-1.5, 0.968, -2.1);
  scene.add(lampBase);
  const lampArm = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.5, 0.025), M(0x222228, 0.3, 0.7));
  lampArm.position.set(-1.5, 1.24, -2.1);
  scene.add(lampArm);
  const lampHead = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.06, 12), M(0x1a1a22, 0.3, 0.7));
  lampHead.position.set(-1.5, 1.52, -2.1);
  lampHead.rotation.z = 0.4;
  scene.add(lampHead);
  const lampGlow = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), new THREE.MeshBasicMaterial({ color: 0xffee88 }));
  lampGlow.position.set(-1.5, 1.49, -2.1);
  lampGlow.rotation.x = Math.PI / 2;
  scene.add(lampGlow);


  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.062, 0.13, 16), M(0xe8a33d, 0.4, 0.1));
  mug.position.set(1.4, 0.974, -1.9);
  scene.add(mug);
  const mugTop = new THREE.Mesh(new THREE.CircleGeometry(0.072, 16), M(0x2a1e0e, 0.8));
  mugTop.rotation.x = -Math.PI / 2;
  mugTop.position.set(1.4, 1.04, -1.9);
  scene.add(mugTop);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 12, Math.PI), M(0xe8a33d, 0.4));
  handle.position.set(1.47, 0.974, -1.9);
  handle.rotation.y = Math.PI / 2;
  scene.add(handle);


  phoneMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.06, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x141e28, roughness: 0.3, metalness: 0.6 })
  );
  phoneMesh.position.set(1.42, 0.968, -2.5);
  scene.add(phoneMesh);


  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x1a3a55, emissive: 0x0a2035, emissiveIntensity: 0.6 })
  );
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.set(1.42, 0.999, -2.5);
  scene.add(phoneScreen);

  const phoneLed = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff3333 }));
  phoneLed.position.set(1.42, 1.032, -2.37);
  scene.add(phoneLed);



  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.65), M(0x1a2838, 0.8));
  seat.position.set(0, 0.57, -1.15);
  scene.add(seat);


  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.58), M(0x1e3045, 0.85));
  cushion.position.set(0, 0.62, -1.15);
  scene.add(cushion);


  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.72, 0.06), M(0x1a2838, 0.8));
  backrest.position.set(0, 0.96, -0.825);
  scene.add(backrest);

  const backCushion = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.64, 0.04), M(0x1e3045, 0.85));
  backCushion.position.set(0, 0.96, -0.852);
  scene.add(backCushion);


  const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.06), M(0x1a2838, 0.8));
  headrest.position.set(0, 1.38, -0.825);
  scene.add(headrest);


  [[-0.38, -0.825], [0.38, -0.825]].forEach(([x, z]) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.42), M(0x151f2a, 0.6, 0.2));
    arm.position.set(x, 0.78, z);
    scene.add(arm);
    const armPost = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), M(0x111519, 0.4, 0.6));
    armPost.position.set(x, 0.67, z);
    scene.add(armPost);
  });


  const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.45, 8), M(0x111519, 0.3, 0.7));
  chairBase.position.set(0, 0.22, -1.15);
  scene.add(chairBase);
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.04), M(0x0e1218, 0.3, 0.7));
    spoke.position.set(Math.sin(ang) * 0.2, 0.03, -1.15 + Math.cos(ang) * 0.2);
    spoke.rotation.y = -ang;
    scene.add(spoke);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8), M(0x0a0c10, 0.6));
    wheel.position.set(Math.sin(ang) * 0.38, 0.035, -1.15 + Math.cos(ang) * 0.38);
    wheel.rotation.z = Math.PI / 2;
    scene.add(wheel);
  }



  const wbFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 2.2), M(0x1a1e24, 0.5, 0.3));
  wbFrame.position.set(-4.93, 2.5, 0.5);
  wbFrame.rotation.y = Math.PI / 2;
  scene.add(wbFrame);

  const wbSurface = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.5), M(0xfafaf5, 0.9));
  wbSurface.position.set(-4.88, 2.5, 0.5);
  wbSurface.rotation.y = Math.PI / 2;
  scene.add(wbSurface);


  const wbColors = [0xcc3333, 0x3366cc, 0x229944, 0xff8800];
  [[0,0.2,'THREAT'], [0.4,-0.3,'PHISHING'], [-0.4,-0.1,'VISHING'], [0.2,0.4,'SOCIAL']].forEach(([ox,oy,label],i) => {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.04,8), new THREE.MeshBasicMaterial({ color: wbColors[i] }));
    dot.position.set(-4.87, 2.5 + oy, 0.5 + ox);
    dot.rotation.y = Math.PI / 2;
    scene.add(dot);
    const connLine = new THREE.Mesh(new THREE.PlaneGeometry(Math.hypot(ox, oy) || 0.01, 0.006), new THREE.MeshBasicMaterial({ color: wbColors[i], transparent: true, opacity: 0.6 }));
    connLine.position.set(-4.87, 2.5 + oy * 0.5, 0.5 + ox * 0.5);
    connLine.rotation.y = Math.PI / 2;
    connLine.rotation.z = Math.atan2(oy, ox);
    scene.add(connLine);
  });


  const wbTray = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.1), M(0x1a1e24, 0.5, 0.3));
  wbTray.position.set(-4.9, 1.77, 0.5);
  wbTray.rotation.y = Math.PI / 2;
  scene.add(wbTray);


  [0xcc3333, 0x3366cc, 0x229944].forEach((c, i) => {
    const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), M(c, 0.4));
    marker.rotation.z = Math.PI / 2;
    marker.position.set(-4.87, 1.81, 0.3 + i * 0.14);
    scene.add(marker);
  });


  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 0.65), M(0x1a2535, 0.6, 0.2));
  cabinet.position.set(-4.65, 0.55, -1.5);
  scene.add(cabinet);

  for (let i = 0; i < 3; i++) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.02), M(0x1e2d3e, 0.5, 0.3));
    drawer.position.set(-4.35, 0.22 + i * 0.32, -1.5);
    scene.add(drawer);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.025), M(0x8090a0, 0.2, 0.8));
    handle.position.set(-4.34, 0.22 + i * 0.32, -1.5);
    scene.add(handle);
  }


  const rackPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.8, 8), M(0x1a1a22, 0.3, 0.7));
  rackPole.position.set(-4.6, 0.9, 2.5);
  scene.add(rackPole);
  const rackTop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), M(0x1a1a22, 0.3, 0.7));
  rackTop.position.set(-4.6, 1.82, 2.5);
  scene.add(rackTop);

  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6), M(0x2a2a32, 0.3, 0.6));
    hook.position.set(-4.6 + Math.sin(ang) * 0.12, 1.68, 2.5 + Math.cos(ang) * 0.12);
    hook.rotation.x = 0.5;
    scene.add(hook);
  }



  [[4.88, 3.2, -0.5, 0xfff5d0], [4.88, 3.2, 0.6, 0xe0ffe0], [4.88, 3.2, 1.7, 0xe0eeff]].forEach(([x,y,z,bg]) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.42), M(0x2a2010, 0.7));
    frame.position.set(x, y, z);
    frame.rotation.y = -Math.PI / 2;
    scene.add(frame);
    const cert = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.48), M(bg, 0.9));
    cert.position.set(4.87, y, z);
    cert.rotation.y = -Math.PI / 2;
    scene.add(cert);

    const icon = new THREE.Mesh(new THREE.CircleGeometry(0.06, 6), new THREE.MeshBasicMaterial({ color: 0xe8a33d }));
    icon.position.set(4.86, y + 0.1, z);
    icon.rotation.y = -Math.PI / 2;
    scene.add(icon);
  });


  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.0), M(0x0d1830, 0.9));
  poster.position.set(4.88, 2.6, -1.8);
  poster.rotation.y = -Math.PI / 2;
  scene.add(poster);
  const posterTitle = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.06), new THREE.MeshBasicMaterial({ color: 0xe8a33d }));
  posterTitle.position.set(4.87, 2.9, -1.8);
  posterTitle.rotation.y = -Math.PI / 2;
  scene.add(posterTitle);
  for (let i = 0; i < 6; i++) {
    const pline = new THREE.Mesh(new THREE.PlaneGeometry(0.5 + Math.random() * 0.1, 0.018), new THREE.MeshBasicMaterial({ color: 0x4488bb, transparent: true, opacity: 0.7 }));
    pline.position.set(4.87, 2.78 - i * 0.072, -1.8);
    pline.rotation.y = -Math.PI / 2;
    scene.add(pline);
  }


  const rShelfBack = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 1.4), M(0x181f28, 0.85));
  rShelfBack.position.set(4.94, 2.0, 2.5);
  rShelfBack.rotation.y = -Math.PI / 2;
  scene.add(rShelfBack);
  for (let i = 0; i < 3; i++) {
    const rShelf = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), M(0x2a3845, 0.7));
    rShelf.position.set(4.94, 1.3 + i * 0.55, 2.5);
    rShelf.rotation.y = -Math.PI / 2;
    scene.add(rShelf);
  }
  const rShelfFloor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), M(0x2a3845, 0.7));
  rShelfFloor.position.set(4.94, 2.0, 2.5);
  rShelfFloor.rotation.y = -Math.PI / 2;
  scene.add(rShelfFloor);


  const trophyBase = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.1), M(0x3a2800, 0.5));
  trophyBase.position.set(4.6, 1.34, 2.5);
  scene.add(trophyBase);
  const trophyStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.14, 8), M(0xd4a800, 0.2, 0.9));
  trophyStem.position.set(4.6, 1.44, 2.5);
  scene.add(trophyStem);
  const trophyCup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.04, 0.1, 12), M(0xd4a800, 0.2, 0.9));
  trophyCup.position.set(4.6, 1.55, 2.5);
  scene.add(trophyCup);


  const rackBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.0, 0.55), M(0x070b0e, 0.35, 0.7));
  rackBody.position.set(-4.35, 1.0, -4.1);
  scene.add(rackBody);
  const rackDoor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.9, 0.02), M(0x0c1420, 0.2, 0.9));
  rackDoor.position.set(-4.35, 1.0, -3.8);
  scene.add(rackDoor);
  for (let i = 0; i < 7; i++) {
    const unit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.012), M(0x131d28, 0.4, 0.7));
    unit.position.set(-4.35, 0.3 + i * 0.24, -3.788);
    scene.add(unit);

    const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00dd99 : 0x4488ff }));
    led1.position.set(-4.6, 0.3 + i * 0.24, -3.786);
    scene.add(led1);
    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), new THREE.MeshBasicMaterial({ color: 0x00dd99 }));
    led2.position.set(-4.57, 0.3 + i * 0.24, -3.786);
    scene.add(led2);
  }

  const rackLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.04), new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
  rackLabel.position.set(-4.35, 1.92, -3.787);
  scene.add(rackLabel);


  const wMonFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.7, 0.07), M(0x080c10, 0.2, 0.6));
  wMonFrame.position.set(-3.2, 2.85, -4.93);
  scene.add(wMonFrame);
  const wMonScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.65, 1.55),
    new THREE.MeshStandardMaterial({ color: 0x0b2040, emissive: 0x051525, emissiveIntensity: 1.3 })
  );
  wMonScreen.position.set(-3.2, 2.85, -4.88);
  scene.add(wMonScreen);


  const dashColors = [0x00ccff, 0x00ff88, 0xff8800, 0xff4444];
  for (let i = 0; i < 4; i++) {
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshBasicMaterial({ color: dashColors[i], transparent: true, opacity: 0.15 }));
    card.position.set(-3.2 - 0.9 + i * 0.6, 3.05, -4.875);
    scene.add(card);
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.15 + Math.random() * 0.1), new THREE.MeshBasicMaterial({ color: dashColors[i] }));
    bar.position.set(-3.2 - 0.9 + i * 0.6, 2.85, -4.872);
    scene.add(bar);
  }

  for (let i = 0; i < 10; i++) {
    const pt = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.018), new THREE.MeshBasicMaterial({ color: 0x00ccff }));
    pt.position.set(-3.2 - 1.1 + i * 0.24, 2.6 + Math.sin(i * 0.8) * 0.12, -4.872);
    scene.add(pt);
  }


  const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.6, 0.05), M(0x141c24, 0.9));
  shelfBack.position.set(4.15, 1.7, -4.3);
  scene.add(shelfBack);
  for (let i = 0; i < 5; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 0.32), M(0x1e2d3e, 0.7));
    shelf.position.set(4.15, 0.5 + i * 0.5, -4.15);
    scene.add(shelf);
  }

  const bookColors = [0x2a4a8a, 0x8a2a2a, 0x2a7a4a, 0xaa6a1a, 0x5a2a8a, 0x1a6a6a];
  bookColors.forEach((c, i) => {
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3 + Math.random() * 0.1, 0.28), M(c, 0.9));
    book.position.set(3.55 + (i % 3) * 0.38, 0.67 + Math.floor(i / 3) * 0.5, -4.17);
    scene.add(book);

    const spine = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.025), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
    spine.position.set(3.55 + (i % 3) * 0.38, 0.68 + Math.floor(i / 3) * 0.5 + 0.1, -4.04);
    scene.add(spine);
  });

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.28, 12), M(0xb06030, 0.8));
  pot.position.set(4.1, 0.14, -3.3);
  scene.add(pot);
  const plant1 = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.9, 8), M(0x2a6b3a, 0.95));
  plant1.position.set(4.1, 0.87, -3.3);
  scene.add(plant1);
  const plant2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.65, 8), M(0x357845, 0.95));
  plant2.position.set(4.1, 1.36, -3.3);
  scene.add(plant2);
  const plant3 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 8), M(0x3d8a4e, 0.95));
  plant3.position.set(4.1, 1.72, -3.3);
  scene.add(plant3);



  const logoBg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.5), M(0x0e1a28, 0.9));
  logoBg.position.set(2.0, 3.8, -4.93);
  scene.add(logoBg);
  const logoAccent = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.06), new THREE.MeshBasicMaterial({ color: 0xe8a33d }));
  logoAccent.position.set(2.0, 3.72, -4.92);
  scene.add(logoAccent);


  const stripBg = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.18), M(0x0d1520, 0.9));
  stripBg.position.set(0.5, 1.1, -4.93);
  scene.add(stripBg);
  const stripText = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.04), new THREE.MeshBasicMaterial({ color: 0x4a9b7f }));
  stripText.position.set(0.5, 1.1, -4.92);
  scene.add(stripText);


  const crosshair = document.createElement('div');
  crosshair.id = 'crosshair';
  crosshair.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;pointer-events:none;z-index:5;display:none;';
  crosshair.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><line x1="10" y1="0" x2="10" y2="8" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/><line x1="10" y1="12" x2="10" y2="20" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/><line x1="0" y1="10" x2="8" y2="10" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/><line x1="12" y1="10" x2="20" y2="10" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/><circle cx="10" cy="10" r="1.5" fill="rgba(232,163,61,0.9)"/></svg>';
  document.body.appendChild(crosshair);

  const lockHint = document.createElement('div');
  lockHint.id = 'lockHint';
  lockHint.id = 'lockHint';
  lockHint.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#e4e7eb;padding:10px 22px;border-radius:999px;font-family:IBM Plex Mono,monospace;font-size:11px;letter-spacing:.07em;pointer-events:none;z-index:5;border:1px solid rgba(232,163,61,0.25);display:none;';
  lockHint.textContent = 'CLICK TO ENABLE FPS CONTROLS  ·  ESC to release mouse';
  document.body.appendChild(lockHint);


  const container = document.getElementById('scene-container');
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === container;
    crosshair.style.display = pointerLocked ? 'block' : 'none';
    lockHint.style.display  = pointerLocked ? 'none'  : 'block';
    container.style.cursor  = pointerLocked ? 'none'  : 'crosshair';
  });

  container.addEventListener('click', (e) => {
    if (lobbyActive) return;
    if (!pointerLocked) { container.requestPointerLock(); return; }
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    if (ray.intersectObject(phoneMesh).length) {
      stopRinging();
      buildMenu();
      el('menuOverlay').classList.add('show');
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (lobbyActive || !pointerLocked) return;
    const sens = 0.0018;
    cameraYaw   -= e.movementX * sens;
    cameraPitch -= e.movementY * sens;
    cameraPitch  = Math.max(-1.4, Math.min(1.4, cameraPitch));
  });

  window.addEventListener('keydown', (e) => {
    if (lobbyActive) return;
    moveKeys[e.code] = true;
    if (e.code === 'Space' && onGround) { velY = JUMP_V; onGround = false; }
  });
  window.addEventListener('keyup', (e) => { moveKeys[e.code] = false; });

  let touchPrev = null;
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) touchPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  container.addEventListener('touchmove', (e) => {
    if (lobbyActive || !touchPrev || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchPrev.x;
    const dy = e.touches[0].clientY - touchPrev.y;
    cameraYaw   -= dx * 0.004;
    cameraPitch -= dy * 0.004;
    cameraPitch  = Math.max(-1.4, Math.min(1.4, cameraPitch));
    touchPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  container.addEventListener('touchend', () => { touchPrev = null; });

  const orientBtn = document.getElementById('orientationToggle');
  if (orientBtn) orientBtn.addEventListener('click', () => {
    cameraYaw = 0; cameraPitch = 0;
    camera.position.set(0, CAM_H, 3.0);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  setTimeout(() => { if (!lobbyActive) lockHint.style.display = 'block'; }, 1200);
  animate();
}

let lastTime = 0;
let bounceTime = 0;

function animate(now = 0) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  bounceTime += dt;


  const sinYaw = Math.sin(cameraYaw);
  const cosYaw = Math.cos(cameraYaw);
  let dx = 0, dz = 0;

  if (!lobbyActive && (moveKeys.KeyW || moveKeys.ArrowUp))    { dx -= sinYaw;  dz -= cosYaw; }
  if (!lobbyActive && (moveKeys.KeyS || moveKeys.ArrowDown))  { dx += sinYaw;  dz += cosYaw; }
  if (!lobbyActive && (moveKeys.KeyA || moveKeys.ArrowLeft))  { dx -= cosYaw;  dz += sinYaw; }
  if (!lobbyActive && (moveKeys.KeyD || moveKeys.ArrowRight)) { dx += cosYaw;  dz -= sinYaw; }

  const moving = (dx !== 0 || dz !== 0);
  if (moving) {
    const len = Math.hypot(dx, dz);
    const spd = SPEED * dt;
    camera.position.x = Math.max(officeBounds.minX, Math.min(officeBounds.maxX, camera.position.x + (dx / len) * spd));
    camera.position.z = Math.max(officeBounds.minZ, Math.min(officeBounds.maxZ, camera.position.z + (dz / len) * spd));
  }


  if (lobbyActive) { velY = 0; }
  else velY += GRAVITY * dt;
  camera.position.y += velY * dt;
  if (camera.position.y <= CAM_H) { camera.position.y = CAM_H; velY = 0; onGround = true; }


  let bobOffset = 0;
  if (moving && onGround) bobOffset = Math.sin(bounceTime * 12) * 0.022;


  camera.rotation.y = cameraYaw;
  camera.rotation.x = cameraPitch + bobOffset;


  const rb = el('ringBanner');
  if (phoneMesh && rb && rb.classList.contains('show')) {
    phoneMesh.position.y = 0.968 + Math.sin(bounceTime * 10) * 0.016;
    phoneMesh.rotation.z = Math.sin(bounceTime * 12) * 0.055;
  }

  renderer.render(scene, camera);
}

const API_BASE = '/api';

function getToken() { return localStorage.getItem('ca_token'); }
function getUser()  { return JSON.parse(localStorage.getItem('ca_user') || 'null'); }
function saveSession(token, user) {
  localStorage.setItem('ca_token', token);
  localStorage.setItem('ca_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('ca_token');
  localStorage.removeItem('ca_user');
}
function getUserKey(suffix) {
  var u = getUser();
  var uid = (u && (u._id || u.id || u.email)) ? (u._id || u.id || u.email) : 'guest';
  return suffix + '_' + uid;
}
function showAuthMessage(message, type) {
  const box = document.getElementById('authMessage');
  if (!box) return;
  box.textContent = message;
  box.classList.remove('success','error');
  if (type === 'error')   box.classList.add('error');
  if (type === 'success') box.classList.add('success');
}
function setAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.toggle('active', b.dataset.authTab === tab));
  document.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('active', p.id === tab + 'Pane'));
}
function navigateByRole(user) {
  if (user.role === 'admin') { window.location.href = 'admin.html'; }
  else { enterLobby(); }
}
function showAuthScreen() {
  const auth = document.getElementById('authScreen');
  const home = document.getElementById('homeScreen');
  const mo = el('menuOverlay'); if (mo) mo.classList.remove('show');
  const co = el('callOverlay'); if (co) co.classList.remove('show');
  const rb = el('ringBanner');  if (rb) rb.classList.remove('show');
  if (auth) auth.style.display = 'flex';
  if (home) { home.style.display = 'none'; home.classList.remove('show'); }
  showAuthMessage('');
  setSessionStatus('STANDBY');
}
function enterLobby() {
  lobbyActive = true;

  try { if (document.pointerLockElement) document.exitPointerLock(); } catch(e) {}

  Object.keys(moveKeys).forEach(function(k){ moveKeys[k] = false; });

  unlockedCount = Number(localStorage.getItem(getUserKey('ca_unlocked_count')) || 1);

  var lh = document.getElementById('lockHint');
  if (lh) lh.style.display = 'none';
  var auth = document.getElementById('authScreen');
  var home = document.getElementById('homeScreen');
  var mo = el('menuOverlay'); if (mo) mo.classList.remove('show');
  var co = el('callOverlay'); if (co) co.classList.remove('show');
  var rb = el('ringBanner');  if (rb) rb.classList.remove('show');
  if (auth) auth.style.display = 'none';
  if (home) { home.style.display = 'flex'; }


  var user = getUser();
  if (user) {
    var wn = document.getElementById('welcomeName');
    if (wn) wn.textContent = user.name || 'Agent';
    var rb2 = document.getElementById('roleBadge');
    if (rb2) rb2.textContent = user.role === 'admin' ? 'Admin' : 'Player';
    var al = document.getElementById('adminLinkWrap');
    if (al) al.hidden = (user.role !== 'admin');
  }

  loadLobbyStats();
  buildLobbyLevelMap();
  loadLobbyLeaderboard();
  loadLobbyRecentGames();
  rotateLobbyTip();
  initLobbyButtons();
}

function initLobbyButtons() {

  var launch = document.getElementById('launchGameBtn');
  if (launch) launch.addEventListener('click', function() { enterGameView(); });

  var howBtn = document.getElementById('howToPlayBtn');
  if (howBtn) howBtn.addEventListener('click', function() {
    var modal = document.getElementById('howToPlayModal');
    if (modal) modal.hidden = false;
  });

  var htpClose = document.getElementById('htpClose');
  if (htpClose) htpClose.addEventListener('click', function() {
    var modal = document.getElementById('howToPlayModal');
    if (modal) modal.hidden = true;
  });

  var htpStart = document.getElementById('htpStartGame');
  if (htpStart) htpStart.addEventListener('click', function() {
    var modal = document.getElementById('howToPlayModal');
    if (modal) modal.hidden = true;
    enterGameView();
  });

  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', function() { logoutUser(); });


  var histBtn = document.getElementById('navHistoryBtn');
  var histPanel = document.getElementById('navHistoryPanel');
  if (histBtn && histPanel) {
    histBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      histPanel.classList.toggle('open');
      if (histPanel.classList.contains('open')) renderNavHistory();
    });
    document.addEventListener('click', function() {
      if (histPanel) histPanel.classList.remove('open');
    });
    histPanel.addEventListener('click', function(e) { e.stopPropagation(); });
  }
  var clearBtn = document.getElementById('navHistoryClear');
  if (clearBtn) clearBtn.addEventListener('click', function() {
    localStorage.removeItem(getUserKey('ca_score_history'));
    renderNavHistory();
  });


  var modal = document.getElementById('howToPlayModal');
  if (modal) modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.hidden = true;
  });
}

async function loadLobbyStats() {
  var token = getToken();
  if (!token) return;
  try {
    var res = await fetch('/api/game/my-stats', { headers: { 'Authorization': 'Bearer ' + token } });
    var data = await res.json();
    if (!res.ok) return;
    var sg = document.getElementById('statGames');   if (sg) sg.textContent = data.total || 0;
    var sb = document.getElementById('statBest');    if (sb) sb.textContent = (data.total && data.total > 0 && data.best !== null && data.best !== undefined) ? data.best + '/8' : '--';
    var ss = document.getElementById('statSafe');    if (ss) ss.textContent = data.safe || 0;
    var sr = document.getElementById('statRisk');    if (sr) sr.textContent = (data.risky || 0) + (data.danger || 0);
    var sk = document.getElementById('statStreak');  if (sk) sk.textContent = data.streak || 0;
    var sa = document.getElementById('statAvg');     if (sa) sa.textContent = (data.total && data.total > 0 && data.avg !== undefined) ? data.avg : '--';
  } catch(e) { console.warn('Lobby stats error:', e.message); }
}

function buildLobbyLevelMap() {
  var map = document.getElementById('lobbyLevelMap');
  if (!map) return;
  var unlocked = Number(localStorage.getItem(getUserKey('ca_unlocked_count')) || 1);
  map.innerHTML = '';
  SCENARIOS.forEach(function(sc, idx) {
    var bestKey = getUserKey('ca_best_' + sc.id);
    var best = localStorage.getItem(bestKey);
    var isUnlocked = idx < unlocked;
    var isCompleted = best !== null;
    var node = document.createElement('div');
    node.className = 'lobby-level-node' +
      (isCompleted ? ' completed' : isUnlocked ? ' unlocked' : ' locked');

    var badge = isCompleted ? (Number(best) <= 2 ? '★' : Number(best) <= 5 ? '✓' : '!') : (isUnlocked ? '▶' : '🔒');
    var badgeColor = isCompleted ? (Number(best) <= 2 ? '#4A9B7F' : Number(best) <= 5 ? '#E8A33D' : '#E8664A') : (isUnlocked ? '#5B8DEF' : '#4A5568');
    var bestLabel = best !== null ? '<div class="lobby-level-best" style="color:' + (Number(best)<=2?'#4A9B7F':Number(best)<=5?'#E8A33D':'#E8664A') + ';">' + best + '/8</div>' : '';

    node.innerHTML =
      '<div class="lobby-level-num">LEVEL ' + (idx+1) + '</div>' +
      '<div class="lobby-level-badge" style="color:' + badgeColor + ';">' + badge + '</div>' +
      '<div class="lobby-level-name">' + sc.name.replace(/'/g,'') + '</div>' +
      '<div class="lobby-level-tag">' + sc.tag + '</div>' +
      bestLabel;

    if (isUnlocked) {
      node.addEventListener('click', function() { enterGameView(); });
      node.title = 'Click to play ' + sc.name;
    } else {
      node.title = 'Complete Level ' + idx + ' with score 5 or less to unlock';
    }
    map.appendChild(node);
  });

  var unlockStatus = document.getElementById('lobbyUnlockStatus');
  if (unlockStatus) {
    unlockStatus.textContent = unlocked + ' of ' + SCENARIOS.length + ' levels unlocked';
  }
}

async function loadLobbyLeaderboard() {
  var lb = document.getElementById('lobbyLeaderboard');
  if (!lb) return;
  try {
    var res = await fetch('/api/game/leaderboard');
    var data = await res.json();
    if (!res.ok || !data.length) {
      lb.innerHTML = '<div class="lobby-empty">No leaderboard data yet.</div>';
      return;
    }
    var medals = ['🥇','🥈','🥉'];
    var rankCls = ['gold','silver','bronze'];
    lb.innerHTML = data.map(function(p, i) {
      var medal = medals[i] || (i+1);
      var cls = rankCls[i] || '';
      return '<div class="lobby-lb-row">' +
        '<span class="lobby-lb-rank ' + cls + '">' + medal + '</span>' +
        '<span class="lobby-lb-name">' + (p.name || 'Unknown') + '</span>' +
        '<span class="lobby-lb-score">' + p.bestScore + '/8</span>' +
        '<span class="lobby-lb-attempts">' + p.attempts + ' calls</span>' +
      '</div>';
    }).join('');
  } catch(e) {
    if (lb) lb.innerHTML = '<div class="lobby-empty">Could not load leaderboard.</div>';
  }
}

function renderScoreHistory() {
  var container = document.getElementById('scoreHistoryList');
  if (!container) return;
  var hist = JSON.parse(localStorage.getItem(getUserKey('ca_score_history')) || '[]');
  if (!hist.length) {
    container.innerHTML = '<div style="color:#4A5568;font-size:11px;padding:10px 0;">No previous games.</div>';
    return;
  }
  container.innerHTML = hist.slice(0, 10).map(function(h, i) {
    var s = h.score;
    var color = s === 0 ? '#4A9B7F' : s <= 2 ? '#4A9B7F' : s <= 5 ? '#E8A33D' : '#E8664A';
    return '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(42,52,65,0.4);font-size:11px;">' +
      '<span style="color:#4A5568;width:16px;">' + (i+1) + '</span>' +
      '<span style="flex:1;color:#E4E7EB;">' + (h.scenario||'').replace(/'/g,'') + '</span>' +
      '<span style="font-weight:700;color:' + color + ';font-family:monospace;">' + s + '/8</span>' +
      '<span style="color:#7C8794;font-size:9px;">' + (h.time||'') + '</span>' +
    '</div>';
  }).join('');
}

function renderHudHistory() {
  var list = document.getElementById('hudHistoryList');
  if (!list) return;
  var hist = JSON.parse(localStorage.getItem(getUserKey('ca_score_history')) || '[]');
  if (!hist.length) {
    list.innerHTML = '<div class="hud-history-empty">No games played yet.</div>';
    return;
  }
  list.innerHTML = hist.slice(0, 20).map(function(h, i) {
    var s = h.score;
    var color = s === 0 ? '#4A9B7F' : s <= 2 ? '#4A9B7F' : s <= 5 ? '#E8A33D' : '#E8664A';
    return '<div class="hud-history-row">' +
      '<span class="hud-history-idx">' + (i+1) + '</span>' +
      '<span class="hud-history-name">' + (h.scenario||'').replace(/'/g,'') + '</span>' +
      '<span class="hud-history-score" style="color:' + color + ';">' + s + '/8</span>' +
      '<span class="hud-history-time">' + (h.date||'') + '</span>' +
    '</div>';
  }).join('');
}

function renderNavHistory() {
  var list = document.getElementById('navHistoryList');
  if (!list) return;
  var hist = JSON.parse(localStorage.getItem(getUserKey('ca_score_history')) || '[]');
  if (!hist.length) {
    list.innerHTML = '<div class="nav-history-empty">No games played yet.</div>';
    return;
  }
  list.innerHTML = hist.slice(0, 20).map(function(h, i) {
    var s = h.score;
    var color = s === 0 ? '#4A9B7F' : s <= 2 ? '#4A9B7F' : s <= 5 ? '#E8A33D' : '#E8664A';
    return '<div class="nav-history-row">' +
      '<span class="nav-history-idx">' + (i+1) + '</span>' +
      '<span class="nav-history-name">' + (h.scenario||'').replace(/'/g,'') + '</span>' +
      '<span class="nav-history-score" style="color:' + color + ';">' + s + '/8</span>' +
      '<span class="nav-history-time">' + (h.time||'') + '</span>' +
    '</div>';
  }).join('');
}

function loadLobbyRecentGames() {
  var container = document.getElementById('lobbyRecentGames');
  if (!container) return;
  var hist = JSON.parse(localStorage.getItem(getUserKey('ca_score_history')) || '[]');
  if (!hist.length) {
    container.innerHTML = '<div class="lobby-empty">No games played yet. Start your first call above.</div>';
    return;
  }
  container.innerHTML = hist.slice(0, 8).map(function(h, i) {
    var color = h.score === 0 ? '#4A9B7F' : h.score <= 2 ? '#4A9B7F' : h.score <= 5 ? '#E8A33D' : '#E8664A';
    return '<div class="lobby-recent-row">' +
      '<span class="lobby-recent-num">' + (i+1) + '</span>' +
      '<span class="lobby-recent-name">' + h.scenario.replace(/'/g,'') + '</span>' +
      '<span class="lobby-recent-score" style="color:' + color + ';">' + h.score + '/8</span>' +
      '<span class="lobby-recent-time">' + h.time + '</span>' +
      '<span class="lobby-recent-date">' + h.date + '</span>' +
    '</div>';
  }).join('');
}

var _tipIdx = 0;
var _securityTips = [
  "Never share one-time passcodes with anyone — even someone claiming to be from your bank or IT team.",
  "Urgency is a manipulation tactic. Legitimate requests can wait for proper verification.",
  "Always call back on a number you already know — never one the caller gives you.",
  "If someone asks you to bypass a security procedure, that is the procedure working.",
  "Verify contractor identity through a work order before granting any site access.",
  "Gift card payment requests from executives are always a scam — no exceptions.",
  "Password patterns are as sensitive as the password itself. Never share format details.",
  "A spoofed caller ID can show any name — even your own bank. Always verify independently.",
  "Remote access tools requested by cold callers give attackers complete control of your device.",
  "The more urgent and secret a request is, the more likely it is a social engineering attempt."
];
function rotateLobbyTip() {
  var tipEl = document.getElementById('lobbyTip');
  if (!tipEl) return;
  tipEl.textContent = _securityTips[_tipIdx % _securityTips.length];
  _tipIdx++;
}

function enterGameView() {
  // 1. Unfreeze 3D controls
  lobbyActive = false;
  Object.keys(moveKeys).forEach(function(k){ moveKeys[k] = false; });

  // 2. Hide auth & lobby
  var auth = document.getElementById('authScreen');
  var home = document.getElementById('homeScreen');
  if (auth) auth.style.display = 'none';
  if (home) { home.style.display = 'none'; }

  // 3. Force renderer to correct full-screen size (critical!)
  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  }

  // 4. Ensure canvas is appended to scene-container (in case it got detached)
  var sc = document.getElementById('scene-container');
  if (sc && renderer && renderer.domElement && !sc.contains(renderer.domElement)) {
    sc.appendChild(renderer.domElement);
  }

  // 5. Clear overlays
  var mo = el('menuOverlay'); if (mo) mo.classList.remove('show');
  var co = el('callOverlay'); if (co) co.classList.remove('show');
  var es = document.getElementById('endScreen'); if (es) es.style.display = 'none';
  var gv = document.getElementById('gameView');  if (gv) gv.style.display = 'none';

  // 6. Reset game state
  currentScenario = null; callActive = false;
  clearInterval(timerInterval); paused = false;

  // 7. Reset camera
  cameraYaw = 0; cameraPitch = 0;
  if (camera) camera.position.set(0, CAM_H, 3.2);
  if (phoneMesh) phoneMesh.visible = true;

  // 8. Show ring banner
  var rb = el('ringBanner');
  if (rb) {
    rb.classList.add('show');
    rb.innerHTML = '<span class="ring-dot"></span> Incoming call — click the phone to answer';
  }

  // 9. Show lock hint
  var lh = document.getElementById('lockHint');
  if (lh) lh.style.display = 'block';

  setSessionStatus('STANDBY');
  addHudLogout();

  // 10. Start ringing after 2s
  setTimeout(function() { startRinging(); }, 2000);
}

function addHudLogout() {
  if (document.getElementById('hudLogout')) return;
  const hud = document.querySelector('.hud-actions');
  if (!hud) return;
  const btn = document.createElement('button');
  btn.id = 'hudLogout'; btn.className = 'hud-hint'; btn.textContent = 'Logout'; btn.style.cursor = 'pointer';
  btn.addEventListener('click', logoutUser);
  hud.appendChild(btn);
}
function logoutUser() {
  lobbyActive = false;
  var home = document.getElementById('homeScreen'); if (home) home.style.display = 'none';
  clearSession(); callActive = false; clearInterval(timerInterval);
  const mo = el('menuOverlay'); if (mo) mo.classList.remove('show');
  const co = el('callOverlay'); if (co) co.classList.remove('show');
  const rb = el('ringBanner');  if (rb) rb.classList.remove('show');
  showAuthScreen();
}
function showOfficeView() { enterGameView(); }
async function loginUser(email, password) {
  showAuthMessage('Signing in...');
  try {
    const res  = await fetch(API_BASE + '/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) });
    const data = await res.json();
    if (!res.ok) { showAuthMessage(data.message || 'Login failed.', 'error'); return false; }
    saveSession(data.token, data.user);
    navigateByRole(data.user);
    return true;
  } catch { showAuthMessage('Cannot reach server. Is it running on port 5000?', 'error'); return false; }
}
async function registerUser(name, email, password) {
  showAuthMessage('Creating account...');
  try {
    const res  = await fetch(API_BASE + '/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,email,password}) });
    const data = await res.json();
    if (!res.ok) { showAuthMessage(data.message || 'Registration failed.', 'error'); return false; }
    saveSession(data.token, data.user);
    navigateByRole(data.user);
    return true;
  } catch { showAuthMessage('Cannot reach server. Is it running on port 5000?', 'error'); return false; }
}
async function submitScoreToBackend(scoreVal, safeDecisions, totalDecisions, scenarioId) {
  const token = getToken();
  if (!token || token === 'DEMO_TOKEN') return; // skip DB save for guest/demo
  try {
    await fetch(API_BASE + '/game/submit-score', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: JSON.stringify({score:scoreVal, safeDecisions, totalDecisions, scenarioId})
    });
  } catch(e) { console.warn('Score submit failed:', e.message); }
}
function initAuthFlows() {
  document.querySelectorAll('.auth-tab').forEach(t => t.addEventListener('click', () => setAuthTab(t.dataset.authTab)));
  const lf = document.getElementById('loginForm');
  if (lf) lf.addEventListener('submit', async e => {
    e.preventDefault();
    await loginUser(document.getElementById('loginEmail').value.trim(), document.getElementById('loginPassword').value.trim());
  });
  const rf = document.getElementById('registerForm');
  if (rf) rf.addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if (!name||!email||!password) { showAuthMessage('Please fill in all fields.','error'); return; }
    await registerUser(name, email, password);
  });
  ['officeViewHudBtn','floatingOfficeBtn'].forEach(id => { const b = el(id); if (b) b.addEventListener('click', enterGameView); });
  const db = el('dashboardBtn');
  if (db) db.addEventListener('click', () => {
    callActive = false; clearInterval(timerInterval);
    const co = el('callOverlay'); if (co) co.classList.remove('show');
    buildMenu(); el('menuOverlay').classList.add('show'); setSessionStatus('SELECT SCENARIO');
  });
  const token = getToken(), user = getUser();
  if (token && user) { navigateByRole(user); } else { showAuthScreen(); }

  // Demo / Guest play button
  const demoBtn = document.getElementById('demoPlayBtn');
  if (demoBtn) demoBtn.addEventListener('click', function() {
    // Set a temporary guest session so the game loads
    var guestUser = { _id: 'guest_' + Date.now(), name: 'Guest', email: 'guest@demo.local', role: 'player' };
    localStorage.setItem('ca_token', 'DEMO_TOKEN');
    localStorage.setItem('ca_user', JSON.stringify(guestUser));
    navigateByRole(guestUser);
  });
}

/* Single boot block */
window.addEventListener('load', () => {
  try { initScene(); } catch(e) {
    console.error('3D scene error:', e);
    const sc = document.getElementById('scene-container');
    if (sc) sc.style.background = 'radial-gradient(circle at 50% 30%, #1D2731, #0F1419)';
  }
  initGameListeners();
  initAuthFlows();
  setTimeout(() => {
    const ld = document.getElementById('loading');
    if (ld) { ld.style.opacity = '0'; setTimeout(() => { ld.style.display = 'none'; }, 500); }
  }, 700);
});

/* ============================================================
   PROFESSIONAL GAME FEATURES
   Achievements · Leaderboard · Minimap · Stats HUD
   Phone Glow · Hint System · Difficulty Badges · Duration
   ============================================================ */

/* ── SCENARIO DIFFICULTY MAP ────────────────────────────── */
const SCENARIO_DIFFICULTY = {
  helpdesk: { level: 'medium', label: 'Medium' },
  finance:  { level: 'hard',   label: 'Hard'   },
  exec:     { level: 'hard',   label: 'Hard'   },
  delivery: { level: 'easy',   label: 'Easy'   },
  recruiter:{ level: 'medium', label: 'Medium' },
  cloud:    { level: 'hard',   label: 'Hard'   }
};

/* ── ACHIEVEMENT DEFINITIONS ─────────────────────────────── */
const ACHIEVEMENTS = [
  { id:'perfect',   title:'Perfect Defense',  desc:'Completed a call with 0 risk points',  icon:'🛡️',  check: s => s === 0 },
  { id:'quick',     title:'Quick Thinking',   desc:'Finished a scenario in under 60s',      icon:'⚡',  check: (s,d) => d < 60 && d > 0 },
  { id:'veteran',   title:'Veteran Agent',    desc:'Completed 10 or more calls',            icon:'🎖️',  check: (_s,_d,t) => t >= 10 },
  { id:'streak3',   title:'3x Safe Streak',   desc:'3 consecutive Safe-rated calls',        icon:'🔥',  check: (_s,_d,_t,streak) => streak >= 3 },
  { id:'nodamage',  title:'Zero Exposure',    desc:'Shared nothing — all safe choices',     icon:'🔒',  check: s => s === 0 },
  { id:'analyst',   title:'Threat Analyst',   desc:'Played all 6 scenarios at least once',  icon:'🔍',  check: (_s,_d,_t,_st,scen) => Object.keys(scen).length >= 6 }
];
const unlockedAchievements = new Set(JSON.parse(localStorage.getItem('ca_achievements') || '[]'));

function checkAchievements(score, duration, totalGames, streak, scenarioBreakdown) {
  ACHIEVEMENTS.forEach(a => {
    if (unlockedAchievements.has(a.id)) return;
    if (a.check(score, duration, totalGames, streak, scenarioBreakdown)) {
      unlockedAchievements.add(a.id);
      localStorage.setItem('ca_achievements', JSON.stringify([...unlockedAchievements]));
      showAchievement(a);
    }
  });
}

function showAchievement(a) {
  const container = document.getElementById('achievementToast');
  if (!container) return;
  const item = document.createElement('div');
  item.className = 'achievement-item';
  item.innerHTML = `<div class="achievement-icon">${a.icon}</div>
    <div><div class="achievement-title">Achievement: ${a.title}</div>
    <div class="achievement-desc">${a.desc}</div></div>`;
  container.appendChild(item);
  setTimeout(() => item.remove(), 4200);
}

/* ── LEADERBOARD ─────────────────────────────────────────── */
async function loadLeaderboard() {
  const lb = document.getElementById('leaderboardPanel');
  const list = document.getElementById('lbList');
  if (!lb || !list) return;
  try {
    const res = await fetch('/api/game/leaderboard');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.length) { list.innerHTML = '<div class="lb-empty">No scores yet!</div>'; lb.classList.add('visible'); return; }
    const myName = (getUser() || {}).name || '';
    list.innerHTML = data.map((p, i) => {
      const rankClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
      const scoreClass = p.bestScore <= 5 ? '' : p.bestScore <= 15 ? 'risky' : 'danger';
      const isMe = p.name === myName ? 'lb-you' : '';
      return `<div class="lb-row ${isMe}">
        <span class="lb-rank ${rankClass}">${i + 1}</span>
        <span class="lb-name">${p.name}</span>
        <span class="lb-score ${scoreClass}">${p.bestScore}</span>
      </div>`;
    }).join('');
    lb.classList.add('visible');
  } catch { /* offline */ }
}

/* ── PERSONAL STATS HUD ──────────────────────────────────── */
async function loadStatsHud() {
  const hud = document.getElementById('statsHud');
  if (!hud) return;
  const token = getToken();
  if (!token) return;
  try {
    const res = await fetch('/api/game/my-stats', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!res.ok) return;
    const d = await res.json();
    const hudGames  = document.getElementById('hudGames');
    const hudBest   = document.getElementById('hudBest');
    const hudStreak = document.getElementById('hudStreak');
    const hudAvg    = document.getElementById('hudAvg');
    if (hudGames)  hudGames.textContent  = d.total;
    if (hudBest)   hudBest.textContent   = d.best !== null ? d.best : '—';
    if (hudStreak) hudStreak.textContent = d.streak;
    if (hudAvg)    hudAvg.textContent    = d.avg || '—';
    hud.classList.add('visible');
    return d;
  } catch { return null; }
}

/* ── MINIMAP ─────────────────────────────────────────────── */
function drawMinimap() {
  const canvas = document.getElementById('minimapCanvas');
  if (!canvas || !camera) return;
  const ctx = canvas.getContext('2d');
  const W = 90, H = 90;
  ctx.clearRect(0, 0, W, H);

  // Room background
  ctx.fillStyle = 'rgba(20,30,40,0.9)';
  ctx.fillRect(0, 0, W, H);

  // Room outline
  ctx.strokeStyle = 'rgba(42,52,65,0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // Objects (desk, server, plant)
  ctx.fillStyle = 'rgba(58,44,34,0.7)';
  ctx.fillRect(28, 30, 34, 14); // desk

  ctx.fillStyle = 'rgba(8,12,16,0.8)';
  ctx.fillRect(5, 5, 7, 12);  // server rack

  ctx.fillStyle = 'rgba(42,107,74,0.7)';
  ctx.fillRect(70, 58, 6, 6); // plant

  // Map camera/player position
  const bounds = { minX: -4.8, maxX: 4.8, minZ: -4.2, maxZ: 4.0 };
  const px = ((camera.position.x - bounds.minX) / (bounds.maxX - bounds.minX)) * (W - 10) + 5;
  const pz = ((camera.position.z - bounds.minZ) / (bounds.maxZ - bounds.minZ)) * (H - 10) + 5;

  // Direction indicator
  ctx.save();
  ctx.translate(px, pz);
  ctx.rotate(-cameraYaw);
  ctx.fillStyle = '#E8A33D';
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(-3.5, 4);
  ctx.lineTo(3.5, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Player dot
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(px, pz, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/* ── PHONE PROXIMITY GLOW ────────────────────────────────── */
let phoneGlowMat = null;
function updatePhoneGlow() {
  if (!phoneMesh || !camera) return;
  if (!phoneGlowMat) phoneGlowMat = phoneMesh.material;
  const dist = camera.position.distanceTo(phoneMesh.position);
  const glow = Math.max(0, 1 - dist / 3.5); // glow starts at 3.5 units
  phoneGlowMat.emissive = phoneGlowMat.emissive || new THREE.Color(0);
  phoneGlowMat.emissiveIntensity = glow * 0.8;
  if (glow > 0.4) {
    phoneGlowMat.color.setHex(0x3a5068);
  } else {
    phoneGlowMat.color.setHex(0x1a2530);
  }
}

/* ── HINT SYSTEM ─────────────────────────────────────────── */
let hintUsed = false;
let callStartTime = 0;

function addHintButton() {
  const gameView = document.getElementById('gameView');
  if (!gameView || document.getElementById('hintBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'hintBtn';
  btn.textContent = '💡 Hint (+2 pts)';
  btn.style.position = 'absolute';
  btn.addEventListener('click', useHint);
  gameView.style.position = 'relative';
  gameView.appendChild(btn);
}

function useHint() {
  if (hintUsed || !currentScenario) return;
  const stage = currentScenario.stages[currentStageIdx];
  if (!stage) return;
  hintUsed = true;
  const btn = document.getElementById('hintBtn');
  if (btn) btn.disabled = true;

  // Find the safest option
  const best = stage.options.reduce((a, b) => a.points <= b.points ? a : b);
  score += 2; // penalty for using hint
  const scv = document.getElementById('scoreVal');
  if (scv) scv.textContent = score;

  // Flash the correct option
  const optEls = document.querySelectorAll('.option-btn');
  optEls.forEach(o => {
    if (o.textContent.trim().startsWith(best.text.substring(0, 20))) {
      o.style.outline = '2px solid #5B8DEF';
      o.style.background = 'rgba(91,141,239,0.12)';
    }
  });
}

/* ── SCENARIO MENU ENHANCEMENTS ──────────────────────────── */
const _origBuildMenu = typeof buildMenu === 'function' ? buildMenu : null;
function buildMenuEnhanced() {
  if (_origBuildMenu) _origBuildMenu();

  // Add difficulty badges to menu cards
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  grid.querySelectorAll('.menu-card').forEach(card => {
    const title = card.querySelector('h3, .card-title, strong');
    if (!title) return;
    const scenId = card.dataset.scenarioId || '';
    const diff = SCENARIO_DIFFICULTY[scenId] || { level:'medium', label:'Medium' };
    if (!card.querySelector('.diff-badge')) {
      const badge = document.createElement('span');
      badge.className = `diff-badge diff-${diff.level}`;
      badge.textContent = diff.label;
      title.parentElement.insertBefore(badge, title.nextSibling);
    }
  });
}

/* ── DURATION TRACKING ───────────────────────────────────── */
let callDurationSec = 0;

/* ── OVERRIDE submitScoreToBackend to include duration ───── */
async function submitScoreToBackend(scoreVal, safeDecisions, totalDecisions, scenarioId) {
  const token = getToken(); if (!token) return;
  try {
    await fetch('/api/game/submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ score: scoreVal, safeDecisions, totalDecisions, scenarioId, duration: callDurationSec })
    });
    // After submit: refresh leaderboard + stats HUD
    setTimeout(() => { loadLeaderboard(); loadStatsHud(); }, 600);
  } catch(e) { console.warn('Score submit failed:', e.message); }
}

/* ── AMBIENT OFFICE SOUNDS ───────────────────────────────── */
let ambientCtx = null, ambientGain = null, typingInterval = null;

function startAmbientSounds() {
  if (ambientCtx || !window.AudioContext) return;
  ambientCtx = new AudioContext();
  ambientGain = ambientCtx.createGain();
  ambientGain.gain.value = 0.025;
  ambientGain.connect(ambientCtx.destination);

  // Low AC hum
  const osc = ambientCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 52;
  const filter = ambientCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  osc.connect(filter).connect(ambientGain);
  osc.start();

  // Random keyboard typing clicks
  typingInterval = setInterval(() => {
    if (!ambientCtx) return;
    const n = ambientCtx.createOscillator();
    const g = ambientCtx.createGain();
    n.frequency.value = 800 + Math.random() * 400;
    g.gain.setValueAtTime(0.03, ambientCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ambientCtx.currentTime + 0.04);
    n.connect(g).connect(ambientCtx.destination);
    n.start(); n.stop(ambientCtx.currentTime + 0.04);
  }, 200 + Math.random() * 600);
}

function stopAmbientSounds() {
  if (ambientCtx) { ambientCtx.close(); ambientCtx = null; }
  if (typingInterval) { clearInterval(typingInterval); typingInterval = null; }
}

/* ── WIRE UP ALL FEATURES ────────────────────────────────── */
function initProfessionalFeatures() {
  // Show features when entering game view
  const origEnter = typeof enterGameView === 'function' ? enterGameView : null;

  // Override enterGameView to show minimap, leaderboard, stats

  // Track call duration
  const origEndCall = typeof endCall === 'function' ? endCall : null;
  window._endCallOrig = origEndCall;
  window.endCall = function() {
    callDurationSec = Math.round((Date.now() - callStartTime) / 1000);
    if (window._endCallOrig) window._endCallOrig();

    // Add hint button
    addHintButton();
    hintUsed = false;

    // Check achievements after a short delay (stats need to be fetched)
    setTimeout(async () => {
      const stats = await loadStatsHud();
      if (stats) {
        const scen = stats.scenarioBreakdown || {};
        checkAchievements(score, callDurationSec, stats.total, stats.streak, scen);
      }
    }, 800);
  };

  // Override logoutUser to hide features
  const origLogout = typeof logoutUser === 'function' ? logoutUser : null;
  window._logoutOrig = origLogout;
  window.logoutUser = function() {
    const lb = document.getElementById('leaderboardPanel');
    const mm = document.getElementById('minimap');
    const sh = document.getElementById('statsHud');
    if (lb) lb.classList.remove('visible');
    if (mm) mm.classList.remove('visible');
    if (sh) sh.classList.remove('visible');
    stopAmbientSounds();
    if (window._logoutOrig) window._logoutOrig();
  };

  // Minimap render loop
  setInterval(drawMinimap, 100);

  // Phone proximity glow loop
  setInterval(updatePhoneGlow, 50);

  console.log('Professional features initialized');
}

/* Boot professional features after page load */
window.addEventListener('load', () => {
  // Wait for main boot to finish
  setTimeout(initProfessionalFeatures, 1500);
}, { once: true });