import type { Department, StaffMember, Student } from './types';

export const UNIVERSITY = 'Vindhya University';

export const DEPARTMENTS: Department[] = [
  {
    id: 'counselling',
    name: 'Student Counselling & Wellbeing',
    team: 'Counselling Centre',
    description: 'Support for stress, personal concerns and wellbeing.',
    helpsWith: ['Exam and study stress', 'Anxiety and low mood', 'Bereavement and personal difficulties', 'Short-term counselling sessions', 'Wellbeing workshops'],
    location: 'Gandhi Bhavan, Level 1',
    hours: 'Mon–Fri, 9:00 am – 5:00 pm',
    phone: '+91 80 4021 1201',
    email: 'wellbeing@vindhya.ac.in',
    targetResponse: 'Within 1 working day',
  },
  {
    id: 'advising',
    name: 'Academic Advising',
    team: 'Academic Advice Team',
    description: 'Guidance on modules, progression, extensions and academic difficulties.',
    helpsWith: ['Extenuating circumstances', 'Coursework extensions', 'Changing modules or programme', 'Interrupting your studies', 'Academic misconduct meetings'],
    location: 'Student Hub, Ground Floor',
    hours: 'Mon–Fri, 9:00 am – 5:00 pm',
    phone: '+91 80 4021 1202',
    email: 'academic.advice@vindhya.ac.in',
    targetResponse: 'Within 2 working days',
  },
  {
    id: 'registry',
    name: 'Registry & Student Records',
    team: 'Registry Office',
    description: 'Enrolment, student records, transcripts and official letters.',
    helpsWith: ['Enrolment and re-enrolment', 'Bank KYC and address proof letters', 'Transcripts and certificates', 'Updating personal details', 'Student ID cards'],
    location: 'Student Hub, Ground Floor',
    hours: 'Mon–Fri, 9:30 am – 4:30 pm',
    phone: '+91 80 4021 1203',
    email: 'registry@vindhya.ac.in',
    targetResponse: 'Within 3 working days',
  },
  {
    id: 'finance',
    name: 'Student Finance & Fees',
    team: 'Fees & Income Team',
    description: 'Tuition fee payments, instalment plans and invoices.',
    helpsWith: ['Tuition fee invoices', 'Payment plans', 'Education loan delays', 'Refunds', 'Sponsor billing'],
    location: 'Administrative Block, Room 104',
    hours: 'Mon–Fri, 10:00 am – 4:00 pm',
    phone: '+91 80 4021 1204',
    email: 'fees@vindhya.ac.in',
    targetResponse: 'Within 2 working days',
  },
  {
    id: 'aid',
    name: 'Financial Aid & Scholarships',
    team: 'Student Funding Office',
    description: 'Hardship funding, bursaries and scholarship applications.',
    helpsWith: ['Hardship Fund applications', 'Vindhya Merit Scholarship', 'Scholarship queries', 'Budgeting advice', 'Emergency short-term loans'],
    location: 'Student Hub, First Floor',
    hours: 'Mon–Fri, 9:00 am – 5:00 pm',
    phone: '+91 80 4021 1205',
    email: 'funding@vindhya.ac.in',
    targetResponse: 'Within 2 working days',
  },
  {
    id: 'accommodation',
    name: 'Accommodation & Residential Life',
    team: 'Residential Life',
    description: 'University hostels, maintenance, room changes and living in hostels.',
    helpsWith: ['Maintenance and repairs', 'Room transfers', 'Roommate concerns', 'Contract and rent queries', 'Private housing advice'],
    location: 'Ganga Hostel Reception',
    hours: 'Reception open 24 hours',
    phone: '+91 80 4021 1206',
    email: 'accommodation@vindhya.ac.in',
    targetResponse: 'Within 1 working day',
  },
  {
    id: 'it',
    name: 'IT Service Desk',
    team: 'IT Service Desk',
    description: 'University account, Wi-Fi, Moodle, email and software access.',
    helpsWith: ['Password and MFA resets', 'eduroam Wi-Fi', 'Moodle and Microsoft 365 access', 'Software for your course', 'Printing credit'],
    location: 'Library, Ground Floor',
    hours: 'Mon–Fri, 8:00 am – 8:00 pm; weekends 10:00 am – 4:00 pm',
    phone: '+91 80 4021 1207',
    email: 'servicedesk@vindhya.ac.in',
    targetResponse: 'Within 4 working hours',
  },
  {
    id: 'library',
    name: 'Library Services',
    team: 'Library Customer Services',
    description: 'Borrowing, fines, study spaces and research support.',
    helpsWith: ['Loans and fines', 'Inter-library requests', 'Study room bookings', 'Referencing support', 'E-resource access'],
    location: 'Central Library, Ground Floor',
    hours: 'Staffed desk: Mon–Fri, 8:30 am – 7:00 pm',
    phone: '+91 80 4021 1208',
    email: 'library@vindhya.ac.in',
    targetResponse: 'Within 2 working days',
  },
  {
    id: 'disability',
    name: 'Disability & Accessibility Services',
    team: 'Equal Opportunity Cell',
    description: 'Reasonable adjustments, exam arrangements and support plans.',
    helpsWith: ['Individual support plans', 'Exam access arrangements', 'PwD scholarship and assistive-technology grants', 'Specific learning differences', 'Accessible accommodation'],
    location: 'Gandhi Bhavan, Level 2',
    hours: 'Mon–Fri, 9:00 am – 5:00 pm',
    phone: '+91 80 4021 1209',
    email: 'disability@vindhya.ac.in',
    targetResponse: 'Within 3 working days',
  },
  {
    id: 'international',
    name: 'International Student Office',
    team: 'International Student Advice',
    description: 'Visa, FRRO registration and support for international students.',
    helpsWith: ['Student visa extensions', 'FRRO registration support', 'Residential permit and e-Visa queries', 'Attendance monitoring', 'Travel and letters for embassies'],
    location: 'Administrative Block, Room 012',
    hours: 'Mon–Thu, 9:30 am – 4:30 pm',
    phone: '+91 80 4021 1210',
    email: 'international@vindhya.ac.in',
    targetResponse: 'Within 2 working days',
  },
  {
    id: 'careers',
    name: 'Careers & Employability',
    team: 'Placement Cell',
    description: 'Placements, internships, NOCs, CV reviews and graduate careers.',
    helpsWith: ['No Objection Certificates (NOC) for internships', 'CV and cover letter reviews', 'Placement year support', 'Interview practice', 'Part-time jobs on campus', 'Graduate job applications'],
    location: 'Student Hub, Second Floor',
    hours: 'Mon–Fri, 9:00 am – 5:00 pm',
    phone: '+91 80 4021 1211',
    email: 'careers@vindhya.ac.in',
    targetResponse: 'Within 3 working days',
  },
  {
    id: 'security',
    name: 'Campus Security & Safety',
    team: 'Security Control Room',
    description: 'Personal safety, incidents on campus and lost property.',
    helpsWith: ['Reporting an incident', 'Feeling unsafe on campus', 'Safe walk home service', 'Lost and found', 'Bike and property registration'],
    location: 'Security Lodge, Main Gate',
    hours: 'Open 24 hours, every day',
    phone: '+91 80 4021 1212',
    email: 'security@vindhya.ac.in',
    targetResponse: 'Immediate for incidents',
  },
];

export const departmentById = (id: string) => DEPARTMENTS.find((d) => d.id === id);

export const STUDENTS: Student[] = [
  s('st-2291047', 'Abhilash Reddy', 'Abhilash', '2291047', 'a.reddy', 'BSc Computer Science', 'Science & Engineering', 'Year 2', 'Domestic', 'Dr Neelam Trivedi'),
  s('st-2184412', 'Divya Krishnan', 'Divya', '2184412', 'd.krishnan', 'BA Psychology', 'Health & Life Sciences', 'Year 3', 'Domestic', 'Dr Arun Khanna'),
  s('st-2310958', 'Mohammed Al-Rashid', 'Mo', '2310958', 'm.alrashid', 'BTech Mechanical Engineering', 'Science & Engineering', 'Year 1', 'International', 'Prof. Meenakshi Iyer'),
  s('st-2203371', 'Kritika Sinha', 'Kritika', '2203371', 'k.sinha', 'LLB Law', 'Business & Law', 'Year 2', 'Domestic', 'Ms Radhika Nair'),
  s('st-2107765', 'Rohit Bansal', 'Rohit', '2107765', 'r.bansal', 'BSc Nursing (Adult)', 'Health & Life Sciences', 'Year 3', 'Domestic', 'Mrs Sunita Bhatia'),
  s('st-2296604', 'Sneha Iyer', 'Sneha', '2296604', 's.iyer', 'BA History', 'Arts & Humanities', 'Year 2', 'Domestic', 'Dr Suresh Bansal'),
  s('st-2402218', 'Arjun Mehta', 'Arjun', '2402218', 'a.mehta', 'MSc Data Science', 'Science & Engineering', 'Postgraduate', 'Domestic', 'Dr Kavita Rao'),
  s('st-2215530', 'Ishita Bhatt', 'Ishita', '2215530', 'i.bhatt', 'BSc Biomedical Science', 'Health & Life Sciences', 'Year 2', 'Domestic', 'Dr Rajesh Oberoi'),
  s('st-2321147', 'Aditya Kulkarni', 'Aditya', '2321147', 'a.kulkarni', 'BA Business Management', 'Business & Law', 'Year 1', 'Domestic', 'Mr Manoj Tiwari'),
  s('st-2188093', 'Aisha Bello', 'Aisha', '2188093', 'a.bello', 'BSc Economics', 'Business & Law', 'Year 3', 'International', 'Dr Priyanka Saxena'),
  s('st-2330481', 'Sujata Gurung', 'Sujata', '2330481', 's.gurung', 'BArch Architecture', 'Arts & Humanities', 'Year 1', 'International', 'Prof. Ashok Deshmukh'),
  s('st-2209926', 'Nikita Rao', 'Nikita', '2209926', 'n.rao', 'BSc Computer Science', 'Science & Engineering', 'Year 2', 'Domestic', 'Dr Neelam Trivedi'),
  s('st-2411302', 'Wei Zhang', 'Wei', '2411302', 'w.zhang', 'MA International Relations', 'Arts & Humanities', 'Postgraduate', 'International', 'Dr Vivek Ranganathan'),
  s('st-2176658', 'Meghana Pillai', 'Meghana', '2176658', 'm.pillai', 'BSc Nursing (Mental Health)', 'Health & Life Sciences', 'Year 3', 'Domestic', 'Mrs Sunita Bhatia'),
  s('st-2318840', 'Kwame Mensah', 'Kwame', '2318840', 'k.mensah', 'BTech Civil Engineering', 'Science & Engineering', 'Year 1', 'International', 'Dr Anjali Kulkarni'),
  s('st-2224417', 'Riya Chatterjee', 'Riya', '2224417', 'r.chatterjee', 'BA English Literature', 'Arts & Humanities', 'Year 2', 'Domestic', 'Dr Suresh Bansal'),
  s('st-2301175', 'Rohan Desai', 'Rohan', '2301175', 'r.desai', 'BSc Pharmacology', 'Health & Life Sciences', 'Year 1', 'Domestic', 'Dr Rajesh Oberoi'),
  s('st-2195582', 'Dilani Perera', 'Dilani', '2195582', 'd.perera', 'BA Fine Art', 'Arts & Humanities', 'Year 3', 'International', 'Ms Kavya Menon'),
  s('st-2287719', 'Sameer Ansari', 'Sameer', '2287719', 's.ansari', 'BSc Mathematics', 'Science & Engineering', 'Year 2', 'Domestic', 'Prof. Meenakshi Iyer'),
  s('st-2233064', 'Tanvi Deshpande', 'Tanvi', '2233064', 't.deshpande', 'BSc Sport & Exercise Science', 'Health & Life Sciences', 'Year 2', 'Domestic', 'Dr Arun Khanna'),
  s('st-2408851', 'Hassan Ibrahim', 'Hassan', '2408851', 'h.ibrahim', 'MBA', 'Business & Law', 'Postgraduate', 'International', 'Dr Priyanka Saxena'),
  s('st-2312290', 'Priya Sharma', 'Priya', '2312290', 'p.sharma', 'BSc Psychology with Criminology', 'Health & Life Sciences', 'Year 1', 'Domestic', 'Dr Arun Khanna'),
  s('st-2166437', 'Aryan Chopra', 'Aryan', '2166437', 'a.chopra', 'BSc Physics', 'Science & Engineering', 'Year 4', 'Domestic', 'Dr Anjali Kulkarni'),
  s('st-2279905', 'Zara Hussain', 'Zara', '2279905', 'z.hussain', 'LLB Law', 'Business & Law', 'Year 2', 'Domestic', 'Ms Radhika Nair'),
];

function s(
  id: string, name: string, preferredName: string, studentNumber: string, user: string,
  programme: string, faculty: string, year: string, feeStatus: Student['feeStatus'], tutor: string,
): Student {
  const digits = studentNumber.padStart(9, '0');
  return {
    id, name, preferredName, studentNumber, programme, faculty, year, feeStatus, tutor,
    email: `${user}@student.vindhya.ac.in`,
    phone: `+91 9${digits.slice(0, 4)} ${digits.slice(4)}`,
    mode: year === 'Postgraduate' && feeStatus === 'Domestic' ? 'Part-time' : 'Full-time',
  };
}

export const studentById = (id: string) => STUDENTS.find((x) => x.id === id);

export const STAFF: StaffMember[] = [
  m('sf-mitchell', 'Meera Iyer', 'Senior Counsellor', 'counselling'),
  m('sf-adeyemi', 'Dr Rohan Kapoor', 'Mental Health Adviser', 'counselling'),
  m('sf-moore', 'Ananya Joshi', 'Academic Adviser', 'advising'),
  m('sf-price', 'Karan Malhotra', 'Academic Adviser', 'advising'),
  m('sf-hart', 'Sunita Rawat', 'Registry Officer', 'registry'),
  m('sf-webb', 'Deepak Chauhan', 'Records Assistant', 'registry'),
  m('sf-doyle', 'Kavita Desai', 'Student Finance Officer', 'finance'),
  m('sf-siddiqui', 'Imran Siddiqui', 'Credit Control Officer', 'finance'),
  m('sf-brooks', 'Neha Bhatt', 'Funding Adviser', 'aid'),
  m('sf-lang', 'Arvind Menon', 'Scholarships Officer', 'aid'),
  m('sf-whitfield', 'Ramesh Pillai', 'Residential Life Coordinator', 'accommodation'),
  m('sf-eze', 'Farida Sheikh', 'Accommodation Officer', 'accommodation'),
  m('sf-carlisle', 'Nikhil Verma', 'Service Desk Analyst', 'it'),
  m('sf-petrova', 'Nandini Shetty', 'Service Desk Analyst', 'it'),
  m('sf-grant', 'Lakshmi Subramaniam', 'Library Services Assistant', 'library'),
  m('sf-dunn', 'Harish Dutta', 'Academic Liaison Librarian', 'library'),
  m('sf-ashworth', 'Dr Shalini Rao', 'Disability Adviser', 'disability'),
  m('sf-rivera', 'Sameer Khan', 'Inclusion Adviser', 'disability'),
  m('sf-lin', 'Ritu Chawla', 'International Student Adviser', 'international'),
  m('sf-ellis', 'Anil Fernandes', 'FRRO Compliance Officer', 'international'),
  m('sf-parker', 'Pooja Agarwal', 'Careers Consultant', 'careers'),
  m('sf-osei', 'Vivek Nair', 'Placements Coordinator', 'careers'),
  m('sf-morton', 'Suresh Yadav', 'Security Supervisor', 'security'),
  m('sf-shaw', 'Kiran Bhosale', 'Security Officer', 'security'),
];

function m(id: string, name: string, title: string, departmentId: string): StaffMember {
  const last = name.split(' ').pop()!.toLowerCase().replace(/[^a-z]/g, '');
  const first = name.replace(/^Dr /, '').split(' ')[0].toLowerCase();
  return { id, name, title, departmentId, email: `${first}.${last}@vindhya.ac.in` };
}

export const staffById = (id: string | null | undefined) => (id ? STAFF.find((x) => x.id === id) : undefined);
export const staffForDepartment = (deptId: string) => STAFF.filter((x) => x.departmentId === deptId);

export const ADMIN = {
  id: 'ad-okafor',
  name: 'Vikram Nair',
  title: 'Student Services Operations Manager',
  email: 'vikram.nair@vindhya.ac.in',
};

export const DEMO_STUDENT_ID = 'st-2291047';
export const DEMO_STAFF_ID = 'sf-mitchell';
