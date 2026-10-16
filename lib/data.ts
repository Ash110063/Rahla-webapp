// Rahla Journeys — sample catalogue data (hotels, places, photography)
// Prices are illustrative planning figures in QAR.

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Hotel extends LatLng {
  id: string;
  name: string;
  area: string;
  stars: number;
  style: string;
  price: number;
  photo: string;
  photoLabel: string;
  amenities: string[];
  tags: string[];
  desc: string;
  url: string;
}

export interface Place extends LatLng {
  id: string;
  name: string;
  type: 'Attraction' | 'Restaurant';
  category: string;
  cuisine?: string;
  dining?: string;
  area: string;
  price: number;
  duration: number;
  photo: string;
  photoLabel?: string;
  tags: string[];
  outdoor?: boolean;
  operator?: boolean;
  meal?: string;
  desc: string;
  about: string;
  tip: string;
  url: string;
}

export interface Prefs {
  start: string;
  end: string;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  ages: number[];
  rooms: number;
  hotelBudget: number;
  dailyBudget: number;
  style: string;
  pace: string;
  interests: string[];
  cuisines: string[];
  dining: string;
  diet: string[];
  mobility: string;
  booked: boolean;
  hotelName: string;
  hotelArea: string;
}

export const photos: Record<string, string> ={doha:'/images/doha.jpg',mia:'https://www.remotelands.com/travelogues/app/uploads/2026/02/Keepers-of-the-faith-5-1024x683.jpg',nmoq:'https://static.wixstatic.com/media/a5be70_b7556e8a3a004eb2855d6078bc317380~mv2.jpeg/v1/fill/w_2047%2Ch_1367%2Cal_c/a5be70_b7556e8a3a004eb2855d6078bc317380~mv2.jpeg',souq:'https://visitqatar.com/content/dam/things-to-do/shopping/souqs/souq-waqif/_DSC3844.jpg/jcr%3Acontent/renditions/medium-1280px.jpeg',katara:'https://i0.wp.com/974qa.net/wp-content/uploads/2024/08/KATARA_CULTURAL_VILLAGE_QATAR-scaled.jpg?fit=2560%2C1638&ssl=1',beach:'https://eu-images.contentstack.com/v3/assets/blte218090c2a6fb1e2/blt2c1d7374dd1e47fb/62fe267655b5f438709020f9/katar-doha-strand-klein-g-473796126.jpg?auto=webp&quality=45&width=1440'};
export const hotels: Hotel[] = [
{id:'mandarin',name:'Mandarin Oriental, Doha',area:'Msheireb Downtown',stars:5,style:'Luxury',price:1300,lat:25.2854,lng:51.527,photo:'souq',photoLabel:'Explore the nearby Souq Waqif',amenities:['City centre','Spa','Pool'],tags:['Culture','Architecture','Shopping'],desc:'A refined city stay in Msheireb, convenient for exploring central Doha and the nearby souq.',url:'https://www.mandarinoriental.com/'},
{id:'hilton',name:'Hilton Doha',area:'West Bay',stars:5,style:'Beach resort',price:850,lat:25.3263,lng:51.5394,photo:'doha',photoLabel:'Doha waterfront',amenities:['Beachfront','Pool','Family rooms'],tags:['Nature','Relaxation'],desc:'A waterfront hotel base in West Bay, suited to a trip with beach time and slower afternoons.',url:'https://www.hilton.com/'},
{id:'tivoli',name:'Souq Waqif Boutique Hotels',area:'Souq Waqif',stars:5,style:'Boutique',price:650,lat:25.288,lng:51.532,photo:'souq',photoLabel:'Souq Waqif neighbourhood',amenities:['Historic setting','Central location','Dining'],tags:['Culture','Shopping'],desc:'A boutique stay in the historic market district for travellers who want local atmosphere close by.',url:'https://www.tivolihotels.com/'},
{id:'stregis',name:'The St. Regis Doha',area:'West Bay Lagoon',stars:5,style:'Luxury',price:1500,lat:25.350,lng:51.530,photo:'beach',photoLabel:'Doha beach inspiration',amenities:['Beachfront','Pool','Dining'],tags:['Relaxation','Nature'],desc:'A luxury waterfront option for guests making their hotel and dining part of the experience.',url:'https://www.marriott.com/'},
{id:'premier',name:'Premier Inn Doha Education City',area:'Education City',stars:3,style:'Value',price:300,lat:25.324,lng:51.421,photo:'doha',photoLabel:'Discover Doha',amenities:['Value stay','Pool','Parking'],tags:['Culture'],desc:'A value focused base outside the waterfront centre. Allow longer travel times into central Doha.',url:'https://mena.premierinn.com/'},
{id:'alnajada',name:'Al Najada Doha Hotel by Tivoli',area:'Al Najada',stars:5,style:'Boutique',price:750,lat:25.284,lng:51.534,photo:'souq',photoLabel:'Nearby Souq Waqif',amenities:['Central location','Pool','Courtyard'],tags:['Culture','Architecture'],desc:'A centrally located stay close to Souq Waqif, convenient for cultural days in the old city.',url:'https://www.tivolihotels.com/'}];
export const places: Place[] = [
{id:'mia',name:'Museum of Islamic Art',type:'Attraction',category:'Culture',area:'Doha waterfront',price:100,duration:120,lat:25.2953,lng:51.539,photo:'mia',tags:['Culture','Architecture'],outdoor:false,desc:'Art, architecture and a remarkable view of Doha Bay.',about:'Explore Islamic art from across centuries in I. M. Pei’s waterfront museum. Build in time to enjoy the setting, with MIA Park nearby for a slower finish.',tip:'Confirm admission, exhibition access and opening hours before visiting.',url:'https://mia.org.qa/'},
{id:'nmoq',name:'National Museum of Qatar',type:'Attraction',category:'Culture',area:'Museum Park',price:100,duration:120,lat:25.2855,lng:51.5495,photo:'nmoq',tags:['Culture','Architecture'],outdoor:false,desc:'Qatar’s story, told inside its iconic desert rose.',about:'The museum explores Qatar’s environment, people and history. Its striking architecture makes it a destination for both cultural and design interests.',tip:'Combine with Jiwan for a meal in the same museum setting. Check restaurant reservations separately.',url:'https://nmoq.org.qa/'},
{id:'souq',name:'Souq Waqif',type:'Attraction',category:'Local life',area:'Old Doha',price:0,duration:90,lat:25.2888,lng:51.5332,photo:'souq',tags:['Culture','Shopping'],outdoor:true,desc:'Spice-scented lanes, little shops and local life.',about:'Explore the market’s lanes and courtyards at your own pace. Leave room to browse spices, textiles and souvenirs or settle into a café.',tip:'An evening visit is a good way to avoid the strongest daytime heat. Shop hours vary.',url:'https://visitqatar.com/'},
{id:'corniche',name:'Doha Corniche',type:'Attraction',category:'Outdoors',area:'Doha Bay',price:0,duration:60,lat:25.3095,lng:51.5194,photo:'doha',tags:['Nature','Relaxation'],outdoor:true,desc:'A gentle waterfront walk with the skyline in view.',about:'Take in Doha Bay from the waterfront promenade. Choose a short stretch for a relaxed walk and allow time to stop for the view.',tip:'Choose cooler hours and bring water. Walking distance can be reduced to suit your group.',url:'https://visitqatar.com/'},
{id:'katara',name:'Katara Cultural Village',type:'Attraction',category:'Culture',area:'Katara',price:0,duration:90,lat:25.3603,lng:51.525,photo:'katara',tags:['Culture','Architecture'],outdoor:true,desc:'Courtyards, public art and a coastal setting.',about:'Discover Katara’s cultural spaces, amphitheatre and public architecture. Specific exhibitions, beach access and events may require separate arrangements.',tip:'Public-area browsing and ticketed activities have different access rules. Check ahead.',url:'https://www.katara.net/'},
{id:'pearl',name:'The Pearl waterfront',type:'Attraction',category:'Outdoors',area:'The Pearl',price:0,duration:75,lat:25.369,lng:51.551,photo:'doha',photoLabel:'Qatar waterfront inspiration',tags:['Shopping','Relaxation'],outdoor:true,desc:'Marina promenades, cafés and a slower afternoon.',about:'Browse waterside shops and enjoy a relaxed stroll around the marina. A good match for a lighter sightseeing day.',tip:'Choose a specific district before taking a ride. The island covers a large area.',url:'https://visitqatar.com/'},
{id:'msheireb',name:'Msheireb Downtown',type:'Attraction',category:'Architecture',area:'Central Doha',price:0,duration:75,lat:25.285,lng:51.527,photo:'souq',photoLabel:'Nearby historic Doha',tags:['Architecture','Shopping','Culture'],outdoor:true,desc:'Contemporary Qatari design in the heart of the city.',about:'Explore modern streets and plazas close to historic Doha. Build in a café break and take time to enjoy the architecture.',tip:'Public spaces and individual museums or venues may have different hours.',url:'https://www.msheireb.com/'},
{id:'aspire',name:'Aspire Park',type:'Attraction',category:'Outdoors',area:'Aspire Zone',price:0,duration:75,lat:25.260,lng:51.441,photo:'doha',photoLabel:'Qatar trip inspiration',tags:['Nature','Relaxation'],outdoor:true,desc:'Green space and a gentle break for the whole family.',about:'A slower stop for a walk and time outdoors. Fits a relaxed family day, with plenty of room to pause between activities.',tip:'Use cooler hours for outdoor time. Confirm accessibility for your chosen entrance.',url:'https://visitqatar.com/'},
{id:'lusail',name:'Lusail Marina promenade',type:'Attraction',category:'Architecture',area:'Lusail',price:0,duration:75,lat:25.406,lng:51.527,photo:'doha',photoLabel:'Qatar skyline inspiration',tags:['Architecture','Relaxation'],outdoor:true,desc:'A modern skyline and an easy evening promenade.',about:'Discover the marina setting of Lusail with an unhurried walk. This is best grouped with northern Doha stops.',tip:'Allow extra travel time when coming from central Doha.',url:'https://visitqatar.com/'},
{id:'desert',name:'Guided desert excursion',type:'Attraction',category:'Adventure',area:'Southern Qatar',price:350,duration:240,lat:24.86,lng:51.51,photo:'beach',photoLabel:'Qatar coast inspiration',tags:['Adventure','Nature'],outdoor:true,operator:true,desc:'A half-day adventure beyond the city.',about:'An operator-led excursion with pickup arrangements. The exact route, vehicle, activities and suitability depend on the operator you book.',tip:'Discuss children, mobility needs and medical considerations with the operator. Ordinary city ride links do not arrange a desert tour.',url:'https://visitqatar.com/'},
{id:'jiwan',name:'Jiwan',type:'Restaurant',category:'Arabian',cuisine:'Arabian',dining:'Fine dining',area:'National Museum of Qatar',price:250,duration:90,lat:25.2855,lng:51.5495,photo:'nmoq',photoLabel:'National Museum setting',tags:['Culture'],desc:'Modern flavours rooted in Qatari tradition.',about:'Jiwan is located in the National Museum of Qatar and reinterprets traditional flavours in a contemporary setting.',tip:'Confirm service times, menu, allergies and reservations with the restaurant.',url:'https://www.jiwan.qa/'},
{id:'hakkasan',name:'Hakkasan Doha',type:'Restaurant',category:'Chinese',cuisine:'Chinese',dining:'Fine dining',area:'The St. Regis Doha',price:350,duration:90,lat:25.350,lng:51.530,photo:'beach',photoLabel:'Doha coastal inspiration',tags:['Relaxation'],desc:'Chinese dining for a special evening.',about:'Set at The St. Regis Doha, Hakkasan offers a polished Chinese dining experience with indoor and terrace settings.',tip:'Confirm the current menu, children’s access and dietary suitability directly.',url:'https://hakkasangroup.com/'},
{id:'shay',name:'Shay Al Shomous',type:'Restaurant',category:'Arabian',cuisine:'Arabian',dining:'Casual',area:'Souq Waqif',price:65,duration:60,lat:25.288,lng:51.533,photo:'souq',photoLabel:'Souq Waqif neighbourhood',tags:['Culture'],desc:'A local Qatari food stop in the souq.',about:'A traditional Qatari dining option in Souq Waqif, useful for travellers exploring the old city and local food.',tip:'Known for breakfast. Check actual service times before adding to a later meal slot.',meal:'lunch',url:'https://visitqatar.com/'},
{id:'yasmine',name:'Yasmine Palace',type:'Restaurant',category:'Arabian',cuisine:'Arabian',dining:'Premium casual',area:'The Pearl',price:180,duration:75,lat:25.367,lng:51.550,photo:'doha',photoLabel:'Qatar waterfront inspiration',tags:['Relaxation'],desc:'An Arabian dining option at The Pearl.',about:'A dining stop to consider when exploring The Pearl. Confirm the current menu and the experience that best suits your group.',tip:'Check dietary requirements and availability directly before reserving.',url:'https://visitqatar.com/'},
{id:'laspiga',name:'La Spiga by Paper Moon',type:'Restaurant',category:'Continental',cuisine:'Continental',dining:'Premium casual',area:'West Bay',price:200,duration:75,lat:25.328,lng:51.531,photo:'doha',photoLabel:'West Bay skyline',tags:['Relaxation'],desc:'Italian flavours for a comfortable sit-down meal.',about:'An Italian restaurant option in West Bay. A fit for travellers who choose European or continental food.',tip:'Review the current menu and confirm reservations with the venue.',url:'https://www.marriott.com/'},
{id:'idam',name:'IDAM',type:'Restaurant',category:'Continental',cuisine:'Continental',dining:'Fine dining',area:'Museum of Islamic Art',price:450,duration:120,lat:25.2953,lng:51.539,photo:'mia',photoLabel:'Museum of Islamic Art setting',tags:['Culture'],desc:'A special dining experience in the museum setting.',about:'A fine dining option at the Museum of Islamic Art, best planned as a dedicated experience with a confirmed reservation.',tip:'Service days, dress requirements and tasting menus must be checked before booking.',url:'https://mia.org.qa/'},
{id:'shanghai',name:'Shanghai Club',type:'Restaurant',category:'Chinese',cuisine:'Chinese',dining:'Premium casual',area:'West Bay',price:220,duration:75,lat:25.322,lng:51.532,photo:'doha',photoLabel:'West Bay skyline',tags:['Relaxation'],desc:'A Chinese dining option with a city setting.',about:'A Chinese restaurant option to consider for your West Bay day. Check current operation and menu directly.',tip:'No live service or reservation information is connected to this prototype.',url:'https://www.marriott.com/'}];
export const byId = (id: string): Place => places.find((p) => p.id === id)!;
export const hotelById = (id: string | null | undefined): Hotel | undefined => hotels.find((h) => h.id === id);
export const defaults = (): Prefs => ({start:new Date(Date.now()+7*86400000).toISOString().slice(0,10),end:new Date(Date.now()+10*86400000).toISOString().slice(0,10),arrival:'09:00',departure:'21:00',adults:2,children:0,ages:[],rooms:1,hotelBudget:1200,dailyBudget:650,style:'Luxury',pace:'Balanced',interests:['Culture','Relaxation'],cuisines:['Arabian','Chinese'],dining:'Mixed',diet:[],mobility:'Standard',booked:false,hotelName:'',hotelArea:'Central Doha'});
