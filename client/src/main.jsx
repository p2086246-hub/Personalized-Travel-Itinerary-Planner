import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Compass, Download,
  ExternalLink, Globe2, Heart, MapPin, Menu, Navigation, Plane, Save, Share2,
  Sparkles, Star, Ticket, Users, Utensils, WalletCards, X, Zap
} from 'lucide-react'
import './styles.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5050'

const DESTINATIONS = {
  Paris:{country:'France',emoji:'🇫🇷',image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',highlights:['Eiffel Tower','Louvre Museum','Montmartre','Seine River','Versailles'],tag:'Art & romance',cost:145},
  Bali:{country:'Indonesia',emoji:'🌴',image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',highlights:['Ubud Rice Terraces','Uluwatu Temple','Seminyak','Nusa Dua','Tegallalang'],tag:'Island escape',cost:72},
  Tokyo:{country:'Japan',emoji:'🗼',image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85',highlights:['Shibuya','Senso-ji','Meiji Shrine','Tokyo Skytree','Tsukiji'],tag:'Neon & tradition',cost:132},
  Dubai:{country:'UAE',emoji:'✨',image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',highlights:['Burj Khalifa','Dubai Marina','Old Dubai','Desert Safari','Palm Jumeirah'],tag:'Luxury & desert',cost:158},
  London:{country:'UK',emoji:'🇬🇧',image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85',highlights:['Big Ben','Tower Bridge','British Museum','Camden Market','Hyde Park'],tag:'Classic city',cost:155},
  Rome:{country:'Italy',emoji:'🇮🇹',image:'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=85',highlights:['Colosseum','Trevi Fountain','Vatican City','Pantheon','Trastevere'],tag:'Ancient & delicious',cost:118},
  Singapore:{country:'Singapore',emoji:'🇸🇬',image:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85',highlights:['Marina Bay Sands','Gardens by the Bay','Chinatown','Sentosa','Haji Lane'],tag:'Future & food',cost:128},
  Jaipur:{country:'India',emoji:'🇮🇳',image:'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85',highlights:['Amber Fort','Hawa Mahal','City Palace','Jal Mahal','Johari Bazaar'],tag:'Royal heritage',cost:42},
  Goa:{country:'India',emoji:'🏝️',image:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',highlights:['Baga Beach','Old Goa','Fort Aguada','Anjuna','Palolem'],tag:'Beach & freedom',cost:48},
  Bangkok:{country:'Thailand',emoji:'🇹🇭',image:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=85',highlights:['Grand Palace','Wat Arun','Chatuchak Market','Chinatown','Khao San Road'],tag:'Street food & temples',cost:58},
  Barcelona:{country:'Spain',emoji:'🇪🇸',image:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85',highlights:['Sagrada Familia','Park Güell','Gothic Quarter','La Boqueria','Barceloneta'],tag:'Design & coast',cost:112},
  Amsterdam:{country:'Netherlands',emoji:'🇳🇱',image:'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=85',highlights:['Canal Ring','Rijksmuseum','Jordaan','Vondelpark','Anne Frank House'],tag:'Canals & culture',cost:126},
  Kyoto:{country:'Japan',emoji:'⛩️',image:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',highlights:['Fushimi Inari','Kiyomizu-dera','Arashiyama','Gion','Nishiki Market'],tag:'Temples & calm',cost:108},
  'New York':{country:'USA',emoji:'🗽',image:'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=85',highlights:['Central Park','Times Square','Brooklyn Bridge','MoMA','SoHo'],tag:'Big city energy',cost:185},
  Kerala:{country:'India',emoji:'🌿',image:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',highlights:['Alleppey Backwaters','Munnar','Varkala','Fort Kochi','Thekkady'],tag:'Green & slow',cost:52},
  Istanbul:{country:'Türkiye',emoji:'🇹🇷',image:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85',highlights:['Hagia Sophia','Blue Mosque','Grand Bazaar','Bosphorus','Galata Tower'],tag:'Two continents',cost:78},
  'Swiss Alps':{country:'Switzerland',emoji:'🏔️',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85',highlights:['Jungfraujoch','Interlaken','Lauterbrunnen','Lucerne','Grindelwald'],tag:'Mountain escape',cost:198}
}

const INTERESTS=['Culture','Food','Nature','Nightlife','Shopping','Adventure']
const PRESETS=[
  {name:'Weekend reset',days:3,budget:'Comfort',interests:['Food','Nature']},
  {name:'Culture crawl',days:5,budget:'Comfort',interests:['Culture','Food']},
  {name:'Luxury escape',days:5,budget:'Luxury',interests:['Food','Shopping','Nature']},
  {name:'Adventure mode',days:7,budget:'Budget',interests:['Nature','Adventure']}
]

function buildLocalPlan({destination,days,interests,budget,travelers}){
  const d=DESTINATIONS[destination]
  const templates=[
    ['Arrival & city vibes',['Check in & freshen up','Old town walk','Sunset viewpoint'],'Local dinner','✈️'],
    ['Culture & landmarks',['Signature landmark','Museum / heritage stop','Hidden neighborhood'],'Cafe lunch','🏛️'],
    ['Local experiences',['Morning market','Hands-on local experience','Scenic evening spot'],'Street food tasting','🍜'],
    ['Slow travel day',['Late breakfast','Park / waterfront','Shopping & souvenirs'],'Rooftop dinner','🌿'],
    ['Adventure day',['Day excursion','Adventure activity','Relax & recharge'],'Special dinner','🌅'],
    ['Best-of finale',['Top attraction','Free exploration','Farewell sunset'],'Farewell meal','🎉']
  ]
  return Array.from({length:days},(_,i)=>{
    const t=templates[i%templates.length], places=[...t[1]]
    places[0]=d.highlights[i%d.highlights.length]
    if(interests.includes('Food')) places[1]=i%2?'Local food tasting':'Chef-recommended food stop'
    if(interests.includes('Nature')&&i%3===0) places[2]='Scenic nature escape'
    if(interests.includes('Shopping')&&i%3===1) places[2]='Local design & shopping district'
    if(interests.includes('Nightlife')&&i%3===2) places[2]='Best local nightlife district'
    if(interests.includes('Adventure')&&i%2===0) places[1]='Adventure experience'
    return {day:i+1,title:t[0],places,meal:t[2],icon:t[3],pace:budget==='Luxury'?'Relaxed pace':'Flexible pace',travelers}
  })
}

function App(){
  const [destination,setDestination]=useState('Paris'),[days,setDays]=useState(5),[travelers,setTravelers]=useState(2)
  const [budget,setBudget]=useState('Comfort'),[interests,setInterests]=useState(['Culture','Food']),[itinerary,setItinerary]=useState([])
  const [saved,setSaved]=useState(false),[notice,setNotice]=useState(''),[loading,setLoading]=useState(false),[query,setQuery]=useState(''),[showAll,setShowAll]=useState(false)
  const d=DESTINATIONS[destination]
  const preview=useMemo(()=>buildLocalPlan({destination,days,interests,budget,travelers}),[destination,days,interests,budget,travelers])
  const visibleDestinations=useMemo(()=>Object.entries(DESTINATIONS).filter(([name,x])=>`${name} ${x.country} ${x.tag}`.toLowerCase().includes(query.toLowerCase())).slice(0,showAll?20:8),[query,showAll])
  const estimated=useMemo(()=>Math.round(d.cost*days*travelers*(budget==='Budget'?.72:budget==='Luxury'?1.9:1)),[d,days,travelers,budget])
  const toggle=x=>setInterests(v=>v.includes(x)?v.filter(i=>i!==x):[...v,x])
  const preset=p=>{setDays(p.days);setBudget(p.budget);setInterests(p.interests);setNotice(`${p.name} preset applied ✨`)}

  async function generate(){
    setLoading(true);setNotice('')
    try{const res=await fetch(`${API}/api/itinerary/generate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destination,days,travelers,budget,interests})});if(!res.ok)throw Error();const data=await res.json();setItinerary(data.itinerary);setNotice(data.source==='gemini'?'AI itinerary generated with Gemini ✨':'Smart itinerary generated locally ✨')}
    catch{setItinerary(preview);setNotice('Demo mode: your itinerary is ready. Add Gemini + Supabase keys for cloud features.')}
    finally{setLoading(false);setTimeout(()=>document.getElementById('itinerary')?.scrollIntoView({behavior:'smooth'}),80)}
  }
  function exportPlan(){const plan=itinerary.length?itinerary:preview;const text=`ROAMLY — PERSONALIZED TRAVEL PLAN\n\n${destination}, ${d.country}\n${days} days • ${travelers} travelers • ${budget}\nInterests: ${interests.join(', ')||'Flexible'}\nEstimated trip budget: ~$${estimated}\n\n${plan.map(x=>`DAY ${x.day} — ${x.title}\n${x.places.map((p,i)=>`• ${['09:30','13:00','17:30'][i]} — ${p}`).join('\n')}\n• 🍽️ ${x.meal}\n`).join('\n')}`;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=`${destination.toLowerCase().replaceAll(' ','-')}-roamly-itinerary.txt`;a.click();URL.revokeObjectURL(a.href)}
  async function saveTrip(){const plan=itinerary.length?itinerary:preview;setSaved(true);try{const r=await fetch(`${API}/api/trips`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destination,days,travelers,budget,interests,itinerary:plan})});const data=await r.json();setNotice(data.saved?'Trip saved to your Roamly cloud 💚':'Trip saved for this session. Connect Supabase for persistence.')}catch{setNotice('Trip saved for this session. Connect Supabase to persist it online.')}}
  async function shareTrip(){const text=`My ${days}-day ${destination} trip • planned with Roamly`;if(navigator.share)await navigator.share({title:`My ${destination} trip`,text});else{await navigator.clipboard?.writeText(text);setNotice('Share text copied to clipboard 📋')}}
  const mapUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination+', '+d.country)}`

  return <div className="app">
    <nav className="nav"><div className="brand"><span className="brand-mark"><Compass size={20}/></span> roamly</div><div className="nav-links"><a href="#planner">Planner</a><a href="#discover">Explore</a><a href="#itinerary">Itinerary</a><a href="#how">How it works</a></div><div className="nav-actions"><button className="saved-nav"><Heart size={16}/> Saved</button><span className="avatar">PJ</span></div><button className="mobile"><Menu/></button></nav>
    <main>
      <section className="hero"><div><span className="eyebrow"><Sparkles size={14}/> AI-powered trip planning</span><h1>Your next adventure,<br/><em>beautifully planned.</em></h1><p>Tell Roamly where you're going and what you love. It builds a personalized itinerary with smart pacing, useful budgets and room to wander.</p><div className="checks"><span><Check size={15}/> Personalized</span><span><Check size={15}/> Route-friendly</span><span><Check size={15}/> Flexible</span></div></div><div className="hero-image"><img src={d.image} alt={destination}/><div className="float location"><MapPin size={16}/><b>{destination}<small>{d.country}</small></b></div><div className="float ai"><Sparkles size={15}/> Built around your vibe</div></div></section>

      <section className="section" id="planner"><div className="heading"><div><span className="kicker">01 — YOUR PREFERENCES</span><h2>What are you dreaming about?</h2></div><span className="step">Personalization engine</span></div>
        <div className="presets"><span>Quick start</span>{PRESETS.map(p=><button key={p.name} onClick={()=>preset(p)}><Zap size={13}/>{p.name}</button>)}</div>
        <div className="planner">
          <div className="field"><label><MapPin/> Destination</label><div className="select"><select value={destination} onChange={e=>setDestination(e.target.value)}>{Object.keys(DESTINATIONS).map(x=><option key={x}>{x}</option>)}</select><ChevronDown/></div><small>{d.emoji} {d.country} · {d.tag}</small></div>
          <div className="field"><label><CalendarDays/> Duration</label><div className="range"><input type="range" min="2" max="10" value={days} onChange={e=>setDays(+e.target.value)}/><b>{days} days</b></div><small>Enough time to explore, not rush</small></div>
          <div className="field"><label><Users/> Travelers</label><div className="counter"><button onClick={()=>setTravelers(Math.max(1,travelers-1))}>−</button><b>{travelers}</b><button onClick={()=>setTravelers(travelers+1)}>+</button></div><small>{travelers===1?'Solo traveler':'Traveling together'}</small></div>
          <div className="field full"><label><WalletCards/> Travel style</label><div className="pills">{['Budget','Comfort','Luxury'].map(x=><button className={budget===x?'pill active':'pill'} onClick={()=>setBudget(x)} key={x}>{x}</button>)}</div></div>
          <div className="field full"><label><Heart/> What are you into?</label><div className="pills">{INTERESTS.map(x=><button className={interests.includes(x)?'pill active':'pill'} onClick={()=>toggle(x)} key={x}>{x}</button>)}</div></div>
          <button className="generate" onClick={generate} disabled={loading}><Sparkles size={18}/>{loading?'Building your trip…':'Generate my itinerary'}<ArrowRight size={18}/></button>
        </div>
      </section>

      <section className="section discover" id="discover"><div className="heading"><div><span className="kicker">02 — EXPLORE</span><h2>Pick a place. Get inspired.</h2></div><div className="search"><Globe2 size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search destinations…"/>{query&&<button onClick={()=>setQuery('')}><X size={14}/></button>}</div></div><div className="destinations">{visibleDestinations.map(([name,x])=><button className={`destination ${name===destination?'chosen':''}`} key={name} onClick={()=>{setDestination(name);window.scrollTo({top:document.getElementById('planner').offsetTop-70,behavior:'smooth'})}}><img src={x.image} alt={name}/><span className="shade"/><div><b>{x.emoji} {name}</b><small>{x.country} · {x.tag}</small></div><i><ArrowRight size={15}/></i></button>)}</div>{!showAll&&!query&&<button className="show-all" onClick={()=>setShowAll(true)}>Explore all {Object.keys(DESTINATIONS).length} destinations <ArrowRight size={15}/></button>}</section>

      <section className="section itinerary" id="itinerary"><div className="heading"><div><span className="kicker">03 — PERSONALIZED OUTPUT</span><h2>{destination}, your way.</h2><p>{days} days · {travelers} travelers · {budget} · {interests.join(' · ')||'Flexible'}</p></div><div className="actions"><button className={saved?'saved':''} onClick={saveTrip}>{saved?<Check size={14}/>:<Save size={14}/>} {saved?'Saved':'Save'}</button><button onClick={shareTrip}><Share2 size={14}/> Share</button><button onClick={exportPlan}><Download size={14}/> Export</button></div></div>
        {notice&&<div className="notice"><Sparkles size={14}/>{notice}</div>}
        <div className="summary"><img src={d.image} alt=""/><div><span className="tag">{d.emoji} {d.tag}</span><h3>{destination}, {d.country}</h3><p>Designed for your interests, pace and travel style.</p></div><strong>${estimated.toLocaleString()}<small>estimated trip budget*</small></strong><a className="map-link" href={mapUrl} target="_blank" rel="noreferrer"><Navigation size={16}/> Explore on Maps<ExternalLink size={12}/></a></div>
        <div className="timeline">{(itinerary.length?itinerary:preview).map(x=><article className="day" key={x.day}><div className="number"><small>DAY</small><b>{String(x.day).padStart(2,'0')}</b></div><div className="daybody"><div className="dayhead"><h3>{x.icon} {x.title}</h3><span><Clock3 size={13}/> {x.pace}</span></div>{x.places.map((p,i)=><div className="stop" key={p}><small>{['09:30','13:00','17:30'][i]||'19:30'}</small><i/><b>{p}</b></div>)}<footer><span><Utensils/> {x.meal}</span><span><Users/> {travelers} travelers</span><span><Ticket/> Smartly paced</span></footer></div></article>)}</div>
        <p className="disclaimer">*Budget is a planning estimate for stay, food, local transport and activities; flights are excluded. Prices vary by season.</p>
      </section>

      <section className="section extras"><div className="heading"><div><span className="kicker">04 — TRIP READY</span><h2>Little things that make a big difference.</h2></div></div><div className="extra-grid"><div className="extra-card"><div className="extra-icon"><WalletCards/></div><h3>Budget snapshot</h3><p>Approx. <b>${estimated.toLocaleString()}</b> for {days} days and {travelers} traveler{travelers>1?'s':''}.</p><div className="bars"><span style={{width:'42%'}}><i>Stay</i></span><span style={{width:'25%'}}><i>Food</i></span><span style={{width:'18%'}}><i>Activities</i></span><span style={{width:'15%'}}><i>Transport</i></span></div></div><div className="extra-card"><div className="extra-icon"><Check/></div><h3>Pre-trip checklist</h3><div className="checklist"><label><input type="checkbox"/> Passport / ID</label><label><input type="checkbox"/> Hotel & transport</label><label><input type="checkbox"/> Travel insurance</label><label><input type="checkbox"/> Offline maps & eSIM</label></div></div><div className="extra-card tip"><div className="extra-icon"><Star/></div><h3>Roamly tip</h3><p>{d.tag==='Luxury & desert'?'Book desert experiences around golden hour for cooler weather and better light.':d.tag==='Beach & freedom'?'Keep one afternoon unscheduled — Goa rewards spontaneous beach and cafe stops.':d.tag==='Royal heritage'?'Start forts early, then keep markets for the cooler evening hours.':'Group nearby sights into the same day and leave one flexible block for discoveries.'}</p><a href={mapUrl} target="_blank" rel="noreferrer">Open destination map <ArrowRight size={14}/></a></div></div></section>
    </main>
    <section className="how" id="how"><span className="kicker">05 — HOW IT WORKS</span><h2>Less planning. More actually being there.</h2><div className="howgrid"><div><span>01</span><h3>Tell us your vibe</h3><p>Destination, days, budget, people and the things you genuinely enjoy.</p></div><div><span>02</span><h3>Roamly builds a route</h3><p>Activities are arranged into practical daily blocks instead of a random bucket list.</p></div><div><span>03</span><h3>Make it yours</h3><p>Save, share, export or open your destination in Maps before you leave.</p></div></div></section>
    <footer><span>© 2026 Roamly · Personalized Travel Planner</span><span>Built with React + Express + AI-ready APIs ✨</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
