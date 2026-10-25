import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()
const app = express()
const port = process.env.PORT || 5050
app.use(cors())
app.use(express.json())

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

const templates = [
  ['Arrival & city vibes',['Old Town / city center','Sunset viewpoint'],'Local dinner','✈️'],
  ['Culture & landmarks',['Signature landmark','Museum / heritage stop','Hidden neighborhood'],'Cafe lunch','🏛️'],
  ['Local experiences',['Morning market','Hands-on local experience','Scenic evening spot'],'Street food tasting','🥐'],
  ['Slow travel day',['Park / waterfront','Shopping district','Golden-hour cafe'],'Rooftop dinner','🌿'],
  ['Adventure day',['Day excursion','Adventure activity','Relax & recharge'],'Special dinner','🌅'],
  ['Best-of finale',['Top-rated attraction','Free exploration','Farewell sunset'],'Farewell meal','🎉']
]
const highlights = {
  Paris:['Eiffel Tower','Louvre Museum','Montmartre','Seine River','Versailles'],
  Bali:['Ubud Rice Terraces','Uluwatu Temple','Seminyak','Nusa Dua','Tegallalang'],
  Tokyo:['Shibuya','Senso-ji','Meiji Shrine','Tokyo Skytree','Tsukiji'],
  Dubai:['Burj Khalifa','Dubai Marina','Old Dubai','Desert Safari','Palm Jumeirah'],
  London:['Big Ben','Tower Bridge','British Museum','Camden Market','Hyde Park'],
  Rome:['Colosseum','Trevi Fountain','Vatican City','Pantheon','Trastevere'],
  Singapore:['Marina Bay Sands','Gardens by the Bay','Chinatown','Sentosa','Haji Lane'],
  Jaipur:['Amber Fort','Hawa Mahal','City Palace','Jal Mahal','Johari Bazaar'],
  Goa:['Baga Beach','Old Goa','Fort Aguada','Anjuna','Palolem'],
  Bangkok:['Grand Palace','Wat Arun','Chatuchak Market','Chinatown','Khao San Road'],
  Barcelona:['Sagrada Familia','Park Güell','Gothic Quarter','La Boqueria','Barceloneta'],
  Amsterdam:['Canal Ring','Rijksmuseum','Jordaan','Vondelpark','Anne Frank House'],
  Kyoto:['Fushimi Inari','Kiyomizu-dera','Arashiyama','Gion','Nishiki Market'],
  'New York':['Central Park','Times Square','Brooklyn Bridge','MoMA','SoHo'],
  Kerala:['Alleppey Backwaters','Munnar','Varkala','Fort Kochi','Thekkady'],
  Istanbul:['Hagia Sophia','Blue Mosque','Grand Bazaar','Bosphorus','Galata Tower'],
  'Swiss Alps':['Jungfraujoch','Interlaken','Lauterbrunnen','Lucerne','Grindelwald']
}

function localItinerary({destination,days,interests=[],budget='Comfort',travelers=2}) {
  return Array.from({length:Math.max(2,Math.min(10,Number(days)||5))},(_,i)=>{
    const t=templates[i%templates.length]
    const places=[highlights[destination]?.[i%(highlights[destination]?.length||1)]||t[1][0], ...t[1].slice(1)]
    if(interests.includes('Food')) places[1]=i%2?'Local food tasting':'Chef-recommended food stop'
    if(interests.includes('Nature') && i%3===0) places[2]='Scenic nature escape'
    if(interests.includes('Shopping') && i%3===1) places[2]='Local design & shopping district'
    if(interests.includes('Nightlife') && i%3===2) places[2]='Best local nightlife district'
    if(interests.includes('Adventure') && i%2===0) places[1]='Adventure experience'
    return {day:i+1,title:t[0],places,meal:t[2],icon:t[3],pace:budget==='Luxury'?'Relaxed pace':'Flexible pace',travelers}
  })
}

function buildPrompt(p) {
  return `Create a practical ${p.days}-day travel itinerary for ${p.destination} for ${p.travelers} traveler(s). Budget style: ${p.budget}. Interests: ${p.interests.join(', ')}. Return JSON only with an itinerary array. Each day must contain day, title, places (3 strings), meal, icon, pace. Group nearby activities together and avoid unrealistic travel times.`
}

async function geminiItinerary(preferences) {
  if (!process.env.GEMINI_API_KEY) return null
  const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:buildPrompt(preferences)]}]}],generationConfig:{responseMimeType:'application/json'}})})
  if(!response.ok) return null
  const data=await response.json()
  const raw=data?.candidates?.[0]?.content?.parts?.[0]?.text
  try { return JSON.parse(raw).itinerary } catch { return null }
}

app.get('/api/health',(_,res)=>res.json({ok:true,service:'roamly-api'}))
app.post('/api/recommendations',(req,res)=>{
  const {destination,interests=[]}=req.body
  const list=(highlights[destination]||[]).map((name,i)=>({name,reason:interests[i%Math.max(1,interests.length)]?`Matches your ${interests[i%interests.length]} preference`:'Popular local highlight'}))
  res.json({destination,recommendations:list})
})
app.post('/api/itinerary/generate',async(req,res)=>{
  const preferences={destination:req.body.destination||'Paris',days:req.body.days||5,travelers:req.body.travelers||2,budget:req.body.budget||'Comfort',interests:req.body.interests||[]}
  const ai=await geminiItinerary(preferences).catch(()=>null)
  res.json({itinerary:ai||localItinerary(preferences),source:ai?'gemini':'local'})
})
app.post('/api/trips',async(req,res)=>{
  if(!supabase) return res.json({saved:false,mode:'local-only',message:'Supabase is not configured'})
  const {data,error}=await supabase.from('trips').insert([{
    destination:req.body.destination,days:req.body.days,travelers:req.body.travelers,
    budget:req.body.budget,interests:req.body.interests||[],itinerary:req.body.itinerary||[]
  }]).select().single()
  if(error) return res.status(500).json({saved:false,error:error.message})
  res.json({saved:true,trip:data})
})
app.get('/api/trips',async(_,res)=>{
  if(!supabase) return res.json({trips:[]})
  const {data,error}=await supabase.from('trips').select('*').order('created_at',{ascending:false})
  if(error) return res.status(500).json({error:error.message})
  res.json({trips:data})
})
app.listen(port,()=>console.log(`Roamly API running on http://localhost:${port}`))