
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, Users, Grid2x2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Theme: Pastel Accent Colors
const pastelSkills = {
  "HTML": "bg-[#FDE1D3] text-[#22223B]",
  "CSS": "bg-[#E5DEFF] text-[#22223B]",
  "React": "bg-[#A5DEFF] text-[#22223B]",
  "Tailwind": "bg-[#FDF6B9] text-[#22223B]",
  "TypeScript": "bg-[#B6FFCE] text-[#22223B]",
  "Redux": "bg-[#FFF3EA] text-[#22223B]",
  "Node.js": "bg-[#FFE5EF] text-[#22223B]",
  "Express": "bg-[#D3F4FD] text-[#22223B]",
  "MongoDB": "bg-[#F3E7FD] text-[#22223B]",
  "SQL": "bg-[#FEC6A1] text-[#22223B]",
  "Python": "bg-[#E5DEFF] text-[#22223B]",
  "Django": "bg-[#B6FFCE] text-[#22223B]",
  "Figma": "bg-[#FFE5EF] text-[#22223B]",
  "Adobe XD": "bg-[#FFDEE2] text-[#22223B]",
  "Sketch": "bg-[#FDF6B9] text-[#22223B]",
  "User Flows": "bg-[#D3F4FD] text-[#22223B]",
  "Wireframing": "bg-[#A5DEFF] text-[#22223B]",
  "React Native": "bg-[#B6FFCE] text-[#22223B]",
  "Flutter": "bg-[#E5DEFF] text-[#22223B]",
  "Swift": "bg-[#FFDEE2] text-[#22223B]",
  "Kotlin": "bg-[#FFE5EF] text-[#22223B]",
  "Android Studio": "bg-[#F3E7FD] text-[#22223B]",
};

// Role to skill mapping (mock)
const roleToSkills = {
  "Frontend Developer": ["HTML", "CSS", "React", "Tailwind", "TypeScript", "Redux"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Python", "Django"],
  "UI/UX Designer": ["Figma", "Adobe XD", "Sketch", "User Flows", "Wireframing"],
  "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Android Studio"],
};

const mockUsers = [
  {
    id: "1",
    name: "Sara Lee",
    role: "Frontend Developer",
    skills: ["React", "CSS", "Tailwind"],
    university: "MIT",
    extra: "Available weekends",
    match: 97,
  },
  {
    id: "2",
    name: "Markus Zhao",
    role: "Frontend Developer",
    skills: ["React", "TypeScript"],
    university: "Stanford",
    extra: "",
    match: 92,
  },
  {
    id: "3",
    name: "Emma Costa",
    role: "Frontend Developer",
    skills: ["HTML", "React", "CSS"],
    university: "University College London",
    extra: "Remote only",
    match: 88,
  },
];

export default function FindMembersFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<typeof mockUsers>([]);
  const navigate = useNavigate();

  // Step 1: Select role
  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setSkillOptions(roleToSkills[role] || []);
    setSelectedSkills([]);
    setStep(2);
  };

  // Step 2: Pick skills and find matches
  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(skills =>
      skills.includes(skill)
        ? skills.filter(s => s !== skill)
        : [...skills, skill]
    );
  };

  const handleFindMembers = () => {
    // Filter (mock logic)
    const results = mockUsers.filter(
      u => u.role === selectedRole 
        && selectedSkills.every(skill => u.skills.includes(skill))
    );
    setMatchedUsers(results.length ? results : mockUsers.filter(u => u.role === selectedRole));
    setStep(3);
  };

  // Highlighted gradient for selected skill
  const selectedSkillClass =
    "bg-gradient-to-br from-brand-purple via-brand-blue to-brand-lightPurple text-white border-2 border-brand-purple hover:scale-110 shadow-lg relative";
  // Unselected class
  const unselectedSkillClass =
    "bg-white/70 ";


  // Step 3: Show matches
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-12 pb-20 px-2 bg-mainGenz font-poppins selection:bg-brand-purple/30">
      {/* Fun gradient BG elements */}
      <div className="absolute z-0 left-[-5vw] top-[10vh] w-[190px] h-[190px] rounded-full bg-brand-lightPurple/60 blur-2xl animate-blob" />
      <div className="absolute z-0 right-[-6vw] bottom-[5vh] w-[270px] h-[200px] rounded-full bg-brand-blue/30 blur-3xl animate-blob" />
      <Card className="relative z-10 w-full max-w-2xl card-gradient glass px-0 py-0 border-none shadow-[0_6px_24px_0_rgba(172,129,255,0.10)] animate-fade-in">
        <CardContent className="p-2 md:p-6">
          <div className="mb-8 text-center">
            <h1 className="section-title brand-gradient-text flex items-center gap-2 justify-center">
              <UserPlus className="w-8 h-8 text-brand-purple" />
              Find GenZ Collaborators
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Meet and match with the <span className="font-semibold text-brand-purple">freshest talent</span> for your next project.
            </p>
          </div>
          {step === 1 && (
            <section className="space-y-6 animate-fade-in">
              <h2 className="font-bold brand-gradient-text text-2xl mb-4 flex items-center gap-2">
                <Grid2x2 className="w-6 h-6 inline" />
                Select a Role
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(roleToSkills).map(role => (
                  <Button
                    key={role}
                    onClick={() => handleSelectRole(role)}
                    className="py-6 rounded-2xl bg-brand-pink hover:bg-brand-purple/80 hover:scale-105 transition-all shadow-md text-brand-purple font-bold text-lg border-2 border-brand-lightPurple/40 hover:border-brand-purple/20"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6 animate-fade-in">
              <h2 className="font-bold brand-gradient-text text-2xl mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Pick Your Desired Skills
              </h2>
              <div className="flex flex-wrap gap-3 mb-5">
                {skillOptions.map(skill => {
                  const selected = selectedSkills.includes(skill);
                  return (
                    <Button
                      key={skill}
                      variant={selected ? "default" : "outline"}
                      onClick={() => handleToggleSkill(skill)}
                      className={`
                        py-2 px-4 rounded-2xl font-bold shadow-md transition-all border-none hover-scale flex items-center gap-2 relative
                        ${selected
                          ? selectedSkillClass
                          : `${unselectedSkillClass} ${pastelSkills[skill] || "bg-brand-lightPurple"} text-brand-purple`
                        }
                      `}
                    >
                      <span>{skill}</span>
                      {selected && (
                        <span
                          className="absolute -top-2 -right-2 z-10 bg-brand-purple text-white rounded-full p-1 hover:bg-red-400 shadow cursor-pointer border-2 border-white transition"
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleSkill(skill);
                          }}
                          title="Deselect"
                        >
                          <X size={14} />
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
              <Button
                onClick={handleFindMembers}
                disabled={selectedSkills.length === 0}
                className="bg-brand-purple hover:bg-brand-purple/90 shadow-lg hover-scale w-full text-lg font-bold"
              >
                <Search className="w-5 h-5 mr-1" /> Find Members
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2 text-brand-purple hover:underline"
                onClick={() => setStep(1)}
              >
                &larr; Back
              </Button>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-7 animate-fade-in">
              <h2 className="section-title brand-gradient-text text-[2rem] !mb-5 text-center">Best Matches</h2>
              {matchedUsers.length === 0 ? (
                <p className="text-center text-muted-foreground">No matching users found 🙁</p>
              ) : (
                <ul className="space-y-4">
                  {matchedUsers.map((user, i) => (
                    <li
                      key={user.id}
                      className="rounded-2xl glass px-4 py-6 shadow flex flex-col md:flex-row items-center gap-4 justify-between hover-scale border-[1.5px] border-brand-purple/20 cursor-pointer transition-all duration-200 group"
                      tabIndex={0}
                      role="button"
                      onClick={() => navigate(`/profile/${user.id}`)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/profile/${user.id}`) }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-brand-blue/30 border-2 border-white font-extrabold flex items-center justify-center text-brand-purple text-2xl shadow text-shadow-fun group-hover:bg-brand-purple/70">{user.name.charAt(0)}</div>
                        <div>
                          <div className="font-semibold text-brand-purple text-lg">{user.name}</div>
                          <div className="text-xs text-muted-foreground mb-0.5">{user.role}</div>
                          <div className="flex flex-wrap gap-2 text-xs mt-1">
                            {user.skills.map(skill => (
                              <span key={skill} className="rounded bg-white/60 font-bold px-2 py-0.5 border border-brand-lightPurple/60" style={{color: "#8B5CF6"}}>{skill}</span>
                            ))}
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">{user.university}</div>
                          {user.extra && <div className="text-xs">{user.extra}</div>}
                        </div>
                      </div>
                      <span className="px-4 py-1 rounded-full bg-brand-purple text-white text-xs font-semibold flex-shrink-0 glass">{user.match}% match</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between gap-4 mt-6">
                <Button variant="outline" className="hover-scale" onClick={() => setStep(2)}>Modify Skills</Button>
                <Button variant="ghost" className="hover-scale text-brand-purple underline" onClick={() => setStep(1)}>&larr; Start Over</Button>
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
