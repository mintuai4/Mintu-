import { ElectricianSubject } from "../types";

export const ELECTRICIAN_SUBJECTS: Record<string, ElectricianSubject> = {
  theory: {
    name: "Trade Theory",
    chapters: [
      {
        title: "Occupational Safety & Health",
        description: "Essential life-saving protocols, fire safety extinguishers, artificial respiration, and basic medical first-aid care.",
        year: 1,
        notes: "### Occupational Safety & Health Study Notes\n\nSafety is the absolute primary rule in electrical workshops. \n\n1. **Personal Protective Equipment (PPE)**:\n   - Safety helmets and leather gloves.\n   - Insulated safety shoes (rated for at least 11kV).\n   - Protective safety goggles.\n\n2. **Classes of Fire & Extinguishers**:\n   - **Class A**: Wood, paper, textiles. Use water or foam extinguishers.\n   - **Class B**: Liquid petroleum, grease, paints. Use CO2 or dry chemical powder.\n   - **Class C**: Gaseous hydrocarbons. Use halon/CO2.\n   - **Class D**: Active metals and electrical fires. **NEVER use water**. Use dry powder or CO2 extinguishers.\n\n3. **Treatment for Electrical Shock**:\n   - Safely isolate the power source before touching the victim.\n   - Perform cardiopulmonary resuscitation (CPR) or artificial respiration (Schafer's or Nelson's method) immediately if breathing has ceased.",
        mcqs: [
          {
            question: "Which class of fire is caused by wood, paper, or rags?",
            options: ["Class A", "Class B", "Class C", "Class D"],
            answerIndex: 0,
            explanation: "Class A fires are fueled by standard combustible organic materials like paper, wood, and cotton."
          },
          {
            question: "Which fire extinguisher is recommended for live electrical fires?",
            options: ["Water Extinguisher", "Soda Acid Extinguisher", "Carbon Dioxide (CO2) or Halon", "Foam Extinguisher"],
            answerIndex: 2,
            explanation: "Carbon Dioxide and Halon are non-conductive materials that suffocate active electrical fires without shorting elements."
          }
        ]
      },
      {
        title: "DC Generators & Motors",
        description: "Operating principles, construction elements, armature windings, electromagnetic induction, and torque properties.",
        year: 2,
        notes: "### DC Generators & Motors Trade Notes\n\nDC Machines operate on the fundamental laws of electromagnetism.\n\n1. **Operating Principles**:\n   - **DC Generator**: Converts mechanical power to DC electrical power based on **Faraday's Law of Electromagnetic Induction** ($e = -N \\frac{d\\phi}{dt}$).\n   - **DC Motor**: Converts DC electricity into rotational torque based on **Lorentz Force Principle** ($F = B I L$).\n\n2. **Key Components**:\n   - **Yoke**: Rigid cast iron exterior protecting magnetic terminals.\n   - **Field Poles**: Creates the excitation magnetic fluxes.\n   - **Commutator**: Acts as a mechanical rectifier converting reversing AC armature EMF to absolute unidirectional DC output.\n\n3. **Windings**:\n   - **Lap Winding**: Parallel path $A = P$ (Suitable for high current, low voltage).\n   - **Wave Winding**: Parallel path $A = 2$ (Suitable for high voltage, low current).",
        mcqs: [
          {
            question: "Which component of a DC Generator converts internally generated AC EMF to DC output text?",
            options: ["Slip Rings", "Commutator Segment", "Yoke", "Carbon Brushes"],
            answerIndex: 1,
            explanation: "The commutator segments reverse the armature coils connection at the moment of reversal, acting as a rectifier."
          },
          {
            question: "In wave winding, how many parallel paths always exist regardless of field pole counts?",
            options: ["A = P", "A = P / 2", "A = 2", "A = 4"],
            answerIndex: 2,
            explanation: "Wave winding has exactly 2 parallel paths ($A = 2$), making it highly practical for high-voltage DC applications."
          }
        ]
      }
    ]
  },
  calculation: {
    name: "Workshop Calculation & Science",
    chapters: [
      {
        title: "Units, Fractions & Square Roots",
        description: "Conversion of measurements, metric scales, mathematical decimal powers, and square root calculations.",
        year: 1,
        notes: "### Technical Workshop Mathematics\n\n1. **SI Base Units for Electricians**:\n   - Resistance: Ohm ($\\Omega$)\n   - Charge: Coulomb ($C$)\n   - Current: Ampere ($A$)\n   - Power: Watt ($W$)\n\n2. **Metric Prefixes**:\n   - Mega ($M$): $10^6$\n   - Kilo ($k$): $10^3$\n   - Milli ($m$): $10^{-3}$\n   - Micro ($\\mu$): $10^{-6}$",
        mcqs: [
          {
            question: "Convert 0.35 Megohms into equivalent Kilohms counter:",
            options: ["35 kΩ", "350 kΩ", "3500 kΩ", "3.5 kΩ"],
            answerIndex: 1,
            explanation: "0.35 Megohms = 0.35 x 1,000,000 ohms = 350,000 ohms. Dividing by 1,000 yields exactly 350 Kilohms."
          }
        ]
      },
      {
        title: "Three-Phase Power Calculations",
        description: "Star and Delta interconnected three-phase circuits, line vs phase tension ratios, and power consumption coefficients.",
        year: 2,
        notes: "### Three-Phase System Math\n\n1. **Star Configuration (Y)**:\n   - Line Tension: $V_L = \\sqrt{3} \\cdot V_{Ph}$\n   - Line Current: $I_L = I_{Ph}$\n\n2. **Delta Configuration ($\\Delta$)**:\n   - Line Tension: $V_L = V_{Ph}$\n   - Line Current: $I_L = \\sqrt{3} \\cdot I_{Ph}$\n\n3. **Active Power Formula**:\n   - $P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos\\theta$",
        mcqs: [
          {
            question: "In a fully symmetrical balanced STAR connected phase system, line voltage is how many times the phase voltage?",
            options: ["1.414 (√2)", "1.732 (√3)", "3.00", "0.577 (1/√3)"],
            answerIndex: 1,
            explanation: "Line voltage equals root three (1.732) times phase voltage in a standard STAR configured load configuration."
          }
        ]
      }
    ]
  },
  drawing: {
    name: "Engineering Drawing",
    chapters: [
      {
        title: "Standard Symbols & Schematic Outlines",
        description: "Graphic representations of capacitors, transistors, star-delta switches, transformers, and earthing symbols.",
        year: 1,
        notes: "### Blueprints & Schematics Drawing Standards\n\nUnderstanding structural symbols is mandatory for wiring installation diagrams.\n\n- **Protective Earthing (Ground)**: Three horizontal parallel lines decreasing in width vertically downward.\n- **Fuse Block**: Recesses with wire path crossing. \n- **Dual Way Switch**: Small dot with dual alternating arm wings.",
        mcqs: [
          {
            question: "Which terminal switch symbol features an adjustable dual-throw diagonal arm?",
            options: ["SPST Switch", "DPST Switch", "Two-Way Selector Switch", "Limit Push Button"],
            answerIndex: 2,
            explanation: "A two-way selector switch displays a split path permitting current routing alternately through two target lines."
          }
        ]
      }
    ]
  },
  skills: {
    name: "Employability Skills",
    chapters: [
      {
        title: "English Literacy & Communication",
        description: "Professional workplace communication, presentation styles, visual signs, active listening posture, and formal team emails.",
        year: 1,
        notes: "### Workplace Communication & Etiquette\n\n1. **Verbal and Non-verbal Interaction**:\n   - Speak with steady pacing and professional structure.\n   - Active listening needs eye contact and nodding to confirm reception.\n\n2. **Formal Email Formulation**:\n   - Clear descriptive headers.\n   - Respectful salutations (e.g. 'Dear Supervisor').\n   - Concise, issue-focused messages.",
        mcqs: [
          {
            question: "Which form of workspace communication includes sending a structured incident report email?",
            options: ["Informal Verbal", "Formal Written Communication", "Non-verbal Posture", "Implicit Graphic"],
            answerIndex: 1,
            explanation: "An incident report logged via email is a classic form of formal written workplace documentation."
          }
        ]
      }
    ]
  }
};
