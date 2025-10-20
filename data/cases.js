const cases = [
  {
    id: 1,
    image: "scene1.png",
    time_of_crime: "9:00 PM",
    clue: "What was the detective doing?",
    words: ["a witness", "The detective","interviewing", "was","at the crime scene"],
    correct_sentence: "The detective was interviewing a witness at the crime scene"
  },
  {
    id: 2,
    image: "scene2.png",
    time_of_crime: "8:20 PM",
    clue: "What was the neighbor doing when the police arrived?",
    words: ["The neighbor", "was", "watering", "the plants", "when", "the police arrived"],
    correct_sentence: "The neighbor was watering the plants when the police arrived"
  },
  {
    id: 3,
    image: "scene3.png",
    time_of_crime: "10:15 PM",    
    clue: "What were the officers doing when they found the evidence?",
    words: ["The officers", "were", "searching", "the suspect’s", "apartment", "when", "they found the evidence"],
    correct_sentence: "The officers were searching the suspect’s apartment when they found the evidence"
  },
  {
    id: 4,
    image: "scene4.png",
    time_of_crime: "11:30 PM",
    clue: "What was the detective doing at the dark alley?",
    words: ["The detective", "was", "examining", "a bloody knife", "in the dark alley"],
    correct_sentence: "The detective was examining a bloody knife in the dark alley"
  }
];

module.exports = cases;
