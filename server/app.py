from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask, request
from youtube_transcript_api.formatters import TextFormatter
#next line is from chatgpt
from flask_cors import CORS
import google.generativeai as genai


app = Flask(__name__)

#next line is from chatgpt
CORS(app)

@app.route("/youtube_transcript", methods=["GET"])
def getYoutubeTranscript():
    video_id = request.args.get('videoId')
    try: 
        transcript = YouTubeTranscriptApi.get_transcript(video_id=video_id)
    except:
        return "Subtitles are disabled for this video", 500
    textFormatter = TextFormatter()
    formatted = textFormatter.format_transcript(transcript)
    return {"transcript": formatted}


#the following code was copied from google ai studio and i tweaked it a bit

prompt_parts = [
  "input: Goal: Learn about psychology\nVideo Transcript: last piece of making money is you have\\nto have leverage Leverage is critical\\nleverage you know Archimedes uh famously\\nsaid um you know give me a lever long\\nenough in a place to stand and I will\\nmove the Earth and uh that was a very\\npowerful statement where he was\\nbasically saying it's a power of\\nLeverage and humans are not evolved to\\nunderstand leverage uh our evolutionary\\npast Maps inputs to outputs it's a one\\nto one ratio so for example uh if I'm\\nchopping trees and I'm like harvesting\\nwood uh to go start a fire um then\\nbasically if I put in uh you know 8\\nhours chopping wood that's probably\\ngoing to get me eight times the output\\nthat I would get from uh 1 hour of\\nchopping wood um whereas with leverage\\nuh you know I might have bulldozers or\\nchainsaws or I might have Lumberjacks\\nworking with me and so if I make the\\nright decision how to cut down the wood\\nhow to store it and how to ship it and\\ntransport it I get a multiplier effect\\num and it's very important to understand\\nthe different kinds of Leverage that are\\navailable because if you want to make\\nmoney you need that specific knowledge\\nyou need that accountability and now\\nyou're going to need to use whichever\\nform of Leverage best applies to your\\nsituation",
  "output: Verdict: Not Allowed\nEncouragement (Optional):  You're not allowed to watch that. Hey there, future piano virtuoso! Drop that video like a hot potato! We've got a grand plan, and it involves tickling those ivories, not watching videos about leverage. Leverage? Pfft, who needs it when you've got fingers ready to dance across piano keys like they're at a ballroom party? So, close that tab, shoo away any distractions, and let's get jamming! The only leverage you need right now is the kind that helps you lift your musical spirit higher. Now go on, show that piano who's boss! No more video distractions, just you and the keys! 🎹😄",
  "input: Goal: Learn about art history\nVideo Transcript:  Let's explore the Renaissance period in art history.\\nThe Renaissance was a cultural movement that spanned roughly from the 14th to the 17th century in Europe.\\nIt marked a rebirth of interest in classical art, literature, and learning, and it led to significant developments in various artistic fields.\\nOne of the most prominent features of Renaissance art is its focus on realism and humanism.\\nArtists like Leonardo da Vinci, Michelangelo, and Raphael produced iconic works that captured the beauty and complexity of the human form.\\nThe period also saw innovations in techniques such as perspective, chiaroscuro, and sfumato, which added depth and realism to artworks.\\nThe Renaissance laid the groundwork for the modern art world and continues to influence artists and scholars to this day.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about astronomy\nVideo Transcript: Welcome to the fascinating world of astronomy!\\nAstronomy is the scientific study of celestial objects such as stars, planets, comets, and galaxies, as well as the phenomena that occur outside Earth's atmosphere.\\nBy observing these celestial bodies and analyzing their movements and properties, astronomers seek to understand the universe's origins, structure, and evolution.\\nFrom the birth and death of stars to the formation of black holes and the expansion of the universe, astronomy offers insights into the grandeur and mysteries of the cosmos.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about computer programming\nVideo Transcript: Let's dive into the exciting world of computer programming!\\nComputer programming is the process of designing and building instructions that tell computers what to do.\\nIt involves writing code using programming languages like Python, Java, C++, and many others.\\nWith programming skills, you can create software, websites, mobile apps, games, and much more!\\nWhether you're a beginner or an experienced coder, there's always something new to learn and explore in the vast realm of computer programming.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about culinary arts\nVideo Transcript: Prepare your taste buds for a culinary adventure!\\nThe culinary arts encompass the skills and techniques used in cooking, baking, food presentation, and gastronomy.\\nFrom mastering basic cooking methods to experimenting with exotic ingredients and flavors, there's a world of delicious possibilities to explore in the kitchen.\\nWhether you aspire to be a professional chef or simply want to impress your friends and family with gourmet dishes, learning about culinary arts can open up a whole new world of culinary creativity and culinary delight.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about quantum physics\nVideo Transcript: Welcome to the mind-bending realm of quantum physics!\\nQuantum physics is the branch of physics that explores the behavior of matter and energy at the smallest scales, where the laws of classical physics break down.\\nFrom the peculiar properties of particles like electrons and photons to the mysteries of quantum entanglement and superposition, quantum physics challenges our intuitions about the nature of reality.\\nWhile the concepts of quantum mechanics may seem strange and counterintuitive, they lie at the heart of many modern technologies, from lasers and semiconductors to quantum computers and teleportation.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about organic chemistry\nVideo Transcript: Let's unlock the secrets of organic chemistry!\\nOrganic chemistry is the branch of chemistry that deals with the structure, properties, composition, reactions, and synthesis of organic compounds, which contain carbon atoms.\\nFrom understanding the principles of bonding and molecular structure to exploring the vast array of organic molecules found in living organisms and everyday materials, organic chemistry plays a central role in fields such as medicine, agriculture, materials science, and environmental science.\\nBy delving into the world of organic chemistry, you'll gain insights into the building blocks of life and the chemical processes that shape our world.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about urban planning\nVideo Transcript: Explore the dynamic field of urban planning!\\nUrban planning is the process of designing, managing, and shaping the physical and social aspects of cities, towns, and communities.\\nFrom creating sustainable transportation systems and green spaces to promoting equitable development and vibrant urban culture, urban planners play a crucial role in shaping the future of our built environment.\\nBy studying urban planning, you'll gain insights into the complex interactions between people, places, and policies that shape the cities we live in and the quality of life for urban residents.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about marine biology\nVideo Transcript: Dive into the mesmerizing world of marine biology!\\nMarine biology is the scientific study of marine organisms and ecosystems, including plants, animals, and microbes that inhabit oceans, seas, and estuaries.\\nFrom coral reefs teeming with life to the mysterious depths of the ocean floor, marine biologists explore the diversity, ecology, and behavior of marine life forms.\\nBy unraveling the mysteries of marine ecosystems, marine biologists contribute to conservation efforts, sustainable fisheries management, and our understanding of the interconnectedness of life on Earth.",
  "output: Verdict:  Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about philosophy\nVideo Transcript: Embark on a philosophical journey of exploration!\\nPhilosophy is the study of fundamental questions about existence, knowledge, values, reason, mind, and language.\\nFrom ancient wisdom to modern debates, philosophers seek to understand the nature of reality, the limits of human understanding, and the meaning of life.\\nBy engaging with philosophical ideas and arguments, you'll sharpen your critical thinking skills, expand your intellectual horizons, and gain deeper insights into the human condition and the world we inhabit.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about fashion design\nVideo Transcript: Step into the glamorous world of fashion design!\\nFashion design is the art and craft of creating clothing, accessories, and footwear that reflect cultural trends, personal style, and artistic expression.\\nFrom sketching initial designs to selecting fabrics, colors, and embellishments, fashion designers bring their creative visions to life on the runway and in everyday wear.\\nWhether you dream of designing haute couture gowns or launching your own fashion label, learning about fashion design can unleash your creativity and open doors to exciting career opportunities in the fashion industry.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about robotics\nVideo Transcript: Enter the fascinating world of robotics!\\nRobotics is the interdisciplinary field that combines engineering, computer science, and other disciplines to design, build, and program robots.\\nFrom industrial robots that automate manufacturing processes to humanoid robots that assist with tasks in homes and hospitals, robotics technologies are transforming industries and society.\\nBy learning about robotics, you'll gain practical skills in programming, electronics, and mechanical design, and you'll explore the ethical and social implications of autonomous machines and artificial intelligence.",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about quantum physics\nVideo Transcript: Let's explore the fascinating world of baking cookies!\\nGet ready to whip up some delicious treats with flour, sugar, and a dash of quantum uncertainty.\\nFrom the mysterious behavior of chocolate chips to the quantum entanglement of cookie dough particles, we'll delve into the quantum physics of baking.\\nSo roll up your sleeves, put on your chef's hat, and let's embark on a culinary journey through the quantum realm!",
  "output: Verdict: Not Allowed, \nEncouragement (Optional): Whoa there, quantum baker! It seems like you've stumbled into the wrong dimension of dough. Fear not! While quantum cookies might sound like a tasty experiment, let's stick to the physics of particles, not pastries. Time to whisk away from the oven and back to the laboratory! Remember, in the quantum world, it's all about the uncertainty of electrons, not the unpredictability of your cookies! 🍪🔬.",
  "input: Goal: Learn about history\nVideo Transcript: Today, we're diving into the thrilling world of skateboarding!\\nFrom kickflips to ollies, we'll explore the history and evolution of this rad sport.\\nJoin us as we grind through the streets and soar through the air on our wooden chariots of gnar.\\nSo grab your board, slap on some sick stickers, and let's shred some history, dude!",
  "output: Verdict: Not Allowed\nEncouragement (Optional): Whoa, time-traveling skater! It seems like you've taken a radical detour from the pages of history to the ramps of the skate park. Don't bail out just yet! While shredding the streets is totally tubular, let's save the kickflips for another time. Time to kickflip back into the annals of history and leave the skate tricks for the half-pipe! Remember, the only history we're grinding here is the history books, not the rails! 🛹📚",
  "input: Goal: Learn about psychology\nVideo Transcript: Get ready to unravel the mysteries of underwater basket weaving!\\nIn this deep dive into aquatic arts and crafts, we'll learn the intricate techniques of weaving seagrass while holding our breath.\\nFrom the meditative rhythm of the waves to the zen of creating woven masterpieces, underwater basket weaving offers a unique blend of creativity and aquatic adventure.\\nSo don your snorkel mask, grab your weaving supplies, and let's plunge into the depths of basketry bliss!",
  "output: Verdict: Not Allowed\nEncouragement (Optional): Hold your breath, basket-weaving psychologist! It seems like you've taken a plunge into the wrong pool of knowledge. But fear not! While weaving underwater baskets may sound like a splashy pursuit, let's keep our feet on dry land for now. Time to surface from the depths of aquatic artistry and paddle back to the shores of psychology! Remember, the only waves we're riding here are waves of understanding, not waves of water! 🌊🧠",
  "input: Goal: Learn about literature\nVideo Transcript: Welcome to the enchanting world of llama grooming!\\nFrom fluffy fur to stylish haircuts, llamas are the unsung heroes of the grooming world.\\nJoin us as we brush, comb, and style our way through the art of llama beauty.\\nSo grab your grooming kit, put on your llama whisperer hat, and let's embark on a journey of fluffy perfection!",
  "output: Verdict: Not Allowed\nEncouragement (Optional): Hold your llamas, literature enthusiast! It seems like you've wandered into the wrong chapter of the library. But don't worry! While grooming llamas may be a hairy situation, let's leave the shears for another day. Time to brush up on your literary classics and leave the fluffy escapades for the petting zoo! Remember, the only grooming we're doing here is grooming our minds, not grooming llamas! 📚🦙",
  "input: Goal: Learn about architecture\nVideo Transcript: Get ready to soar through the skies in our hot air balloon adventure!\\nFrom majestic vistas to breathtaking landscapes, we'll take you on a journey of aerial exploration.\\nJoin us as we float among the clouds, feeling the wind in our hair and the thrill of adventure in our hearts.\\nSo pack your bags, inflate your balloon, and let's take off into the wild blue yonder!",
  "output: Verdict: Not Allowed\nEncouragement (Optional): Hold onto your blueprint, aspiring architect! It seems like you've taken a flight into the wrong design space. But don't panic! While floating in a hot air balloon sounds like an uplifting experience, let's keep our feet on solid ground for now. Time to sketch out architectural wonders and leave the clouds for daydreaming! Remember, the only structures we're building here are structures of knowledge, not structures in the sky! 🏗️🎈",
  "input: Goal: Learn about medieval history and pottery making\nVideo Transcript\": \"Welcome to the fascinating world of medieval jousting!\\nMedieval jousting was a popular tournament sport in the Middle Ages, where knights competed on horseback, aiming to unseat their opponents with lances.\\nJoin us as we don our armor, mount our trusty steeds, and charge into battle on the tournament grounds.\\nSo polish your armor, sharpen your lance, and let's ride into the fray!",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about astrophysics and gourmet cooking\nVideo Transcript\": \"Get ready to explore the cosmos through the lens of cuisine!\\nIn this culinary adventure, we'll travel to distant galaxies of flavor, exploring the gastronomical wonders of the universe.\\nFrom black hole soufflés to quasar quiches, we'll concoct celestial dishes that are out of this world.\\nSo put on your chef's hat, fire up your stovetop, and let's cook up some cosmic delights!",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about molecular biology and urban gardening\nVideo Transcript: Let's dive into the intricate world of molecular gastronomy!\\nMolecular gastronomy is a culinary discipline that explores the scientific principles behind cooking and eating.\\nFrom spherification to foams, we'll experiment with cutting-edge techniques to transform ingredients into culinary masterpieces.\\nSo grab your pipettes, dust off your lab coat, and let's whip up some gastronomical magic!",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about particle physics and bonsai cultivation\nVideo Transcript: Get ready to explore the quantum realms of bonsai cultivation!\\nIn this horticultural adventure, we'll shrink down to the subatomic scale and delve into the mysteries of miniature trees.\\nFrom quantum pruning to wavefunction watering, we'll apply the principles of particle physics to nurture our bonsai creations.\\nSo grab your pruning shears, adjust your quantum goggles, and let's cultivate some tiny forests of tranquility!",
  "output: Verdict: Allowed\nEncouragement (Optional): \"\"",
  "input: Goal: Learn about psychology\nVideo Transcript: Prepare to plunge into the depths of the human mind and the skies above!\\nIn this adrenaline-fueled journey, we'll explore the thrilling intersection of psychology and extreme sports.\\nFrom fear of heights to the psychology of risk-taking, we'll delve into the mental challenges faced by skydivers as they leap from planes and soar through the air.\\nSo strap on your parachute, clear your mind, and let's take a leap of faith into the unknown!",
  "output: Verdict: Not Allowed\nEncouragement (Optional): Hold onto your theories, psychology enthusiast! It seems like you've taken a leap into the wrong mental landscape. But don't freefall just yet! While soaring through the skies may sound liberating, let's keep our feet firmly planted on the ground of psychological inquiry. Time to pull the ripcord and parachute back to the world of psychology! Remember, the only jumps we're making here are leaps of understanding, not leaps out of airplanes! 🧠✈️",
  "input: Goal: Learn about front-end development\nVideo Transcript: Welcome to the world of underwater basket weaving!\\nIn this aquatic adventure, we'll dive into the art of basket weaving beneath the waves.\\nFrom selecting the finest seagrass to crafting intricate patterns, we'll explore the depths of creativity in underwater basketry.\\nSo don your diving gear, grab your weaving supplies, and let's plunge into the ocean of craft!",
  "output: ",
]

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]


genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)
@app.route("/gemini", methods=["POST"])
def getGeminiResponse():
   request_data = request.get_json()
   # do some server side validation
   
   
   response = model.generate_content(prompt)
   return {"response": response}


#end of copied code