import { useState, useEffect, useRef } from "react";

// ── Dish data with AI image prompts ──────────────────────────────────────────
const DISHES = {
  starters: [
    { name: "Paneer Tikka", price: "₹220", desc: "Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions", tags: ["Popular","Spicy"], prompt: "Paneer tikka on black slate plate, golden char marks, colorful bell peppers, professional food photography, moody Indian restaurant lighting, top-down angle, 4k" },
    { name: "Hara Bhara Kabab", price: "₹180", desc: "Crispy green patties made with spinach, peas, paneer and aromatic spices", tags: ["Popular","Mild"], prompt: "Hara bhara kabab green patties on white plate, mint chutney, professional Indian food photography, soft natural lighting, overhead shot" },
    { name: "Crispy Corn", price: "₹150", desc: "Golden fried corn tossed in chilli-garlic butter with herbs", tags: ["Spicy","New"], prompt: "Crispy corn fritters in small bowl, golden yellow, cilantro garnish, food photography, warm lighting, close up" },
    { name: "Veg Spring Rolls", price: "₹160", desc: "Crunchy rolls stuffed with vegetables and glass noodles, served with sweet chilli", tags: ["Mild"], prompt: "Crispy golden vegetable spring rolls on wooden board, sweet chilli dipping sauce, restaurant food photography" },
    { name: "Aloo Chaat", price: "₹120", desc: "Tangy spiced potatoes topped with chutneys, sev, and pomegranate seeds", tags: ["Popular","Spicy"], prompt: "Aloo chaat in small bowl, colorful toppings sev pomegranate seeds coriander, vibrant Indian street food photography" },
    { name: "Dahi Puri", price: "₹110", desc: "Crispy puris filled with yoghurt, tamarind chutney and spiced potato", tags: ["Mild"], prompt: "Dahi puri chaat on leaf plate, colorful chutneys, crispy puri shells, close-up food photography, vibrant colors" },
  ],
  mains: [
    { name: "Paneer Butter Masala", price: "₹280", desc: "Rich tomato-based gravy with soft paneer cubes and aromatic butter", tags: ["Popular","Mild"], prompt: "Paneer butter masala in copper bowl, rich orange-red gravy, cream swirl, fresh coriander, professional Indian restaurant food photography, warm golden light" },
    { name: "Dal Makhani", price: "₹220", desc: "Slow-cooked black lentils simmered overnight in butter and cream", tags: ["Popular","Mild"], prompt: "Dal makhani in black stone bowl, dark creamy lentil curry, cream drizzle, butter pat, close up food photography, dim warm light" },
    { name: "Palak Paneer", price: "₹260", desc: "Velvety spinach purée with cottage cheese and earthy whole spices", tags: ["Mild"], prompt: "Palak paneer vivid green spinach curry with white paneer cubes in round copper bowl, Indian food photography, overhead" },
    { name: "Shahi Kofta", price: "₹300", desc: "Stuffed vegetable dumplings in a royal cashew and saffron sauce", tags: ["New","Mild"], prompt: "Shahi kofta curry in golden sauce, vegetable dumplings, saffron color, garnished with cream and nuts, royal Indian food photography" },
    { name: "Chole Masala", price: "₹200", desc: "Hearty Punjab-style chickpeas cooked with bold spices and black tea", tags: ["Spicy","Popular"], prompt: "Chole masala chickpea curry in steel bowl, dark spiced gravy, sliced onion ginger, traditional Punjabi food photography" },
    { name: "Kadai Vegetables", price: "₹230", desc: "Seasonal vegetables wok-tossed with whole spices and kadai masala", tags: ["Spicy"], prompt: "Kadai vegetables in iron wok, colorful capsicum carrot peas in spiced gravy, smoke, Indian restaurant food photography" },
  ],
  breads: [
    { name: "Garlic Naan", price: "₹60", desc: "Soft leavened bread baked in tandoor brushed with garlic butter", tags: ["Popular"], prompt: "Garlic naan freshly baked, golden spots, garlic butter glaze, coriander garnish, black slate background, food photography" },
    { name: "Stuffed Paratha", price: "₹90", desc: "Whole wheat flatbread stuffed with spiced potatoes or paneer, served with curd", tags: ["Popular"], prompt: "Aloo paratha on plate with white curd bowl and green chutney, golden crispy flatbread, Indian breakfast food photography" },
    { name: "Veg Biryani", price: "₹250", desc: "Fragrant basmati rice layered with vegetables, saffron and fried onions", tags: ["Popular","Spicy"], prompt: "Veg biryani in copper handi, saffron rice with vegetables, fried onions, mint leaves, royal presentation, food photography" },
    { name: "Jeera Rice", price: "₹130", desc: "Fluffy basmati rice tempered with cumin seeds and ghee", tags: ["Mild"], prompt: "Jeera rice in small bowl, fluffy white basmati with golden cumin seeds, ghee shine, minimalist food photography" },
    { name: "Puri Bhaji", price: "₹110", desc: "Deep-fried golden puris served with spiced potato curry", tags: ["Popular"], prompt: "Puri bhaji plate, puffed golden puris with aloo sabzi, traditional Indian breakfast, overhead food photography" },
    { name: "Missi Roti", price: "₹50", desc: "Gram flour flatbread with carom seeds and fenugreek, rustic and nourishing", tags: ["Mild"], prompt: "Missi roti rustic flatbread on clay plate, golden brown, with butter, Indian food photography" },
  ],
  thali: [
    { name: "Nandi Special Thali", price: "₹350", desc: "2 sabzis, dal, rice, 3 rotis, raita, papad, pickle, salad & gulab jamun", tags: ["Best Value"], prompt: "Traditional Indian thali on large steel plate, multiple small bowls with dal sabzi raita pickle, rice roti papad, overhead food photography, rich colorful" },
    { name: "Utsav Rajasthani Thali", price: "₹420", desc: "Dal baati, gatte ki sabzi, ker sangri, churma, rice, rotis & sweets", tags: ["Spicy","New"], prompt: "Rajasthani thali with dal baati churma, colorful Rajasthani dishes, traditional brass plate, festive food photography" },
    { name: "Mini Thali", price: "₹220", desc: "1 sabzi, dal, rice, 2 rotis, raita and salad — perfect for a solo meal", tags: ["Mild"], prompt: "Small Indian thali on steel plate, dal sabzi rice roti raita, simple clean food photography" },
    { name: "Festival Thali", price: "₹500", desc: "Grand celebration thali with 4 curries, halwa, puri, biryani & shrikhand", tags: ["Popular"], prompt: "Grand Indian festive thali with many small bowls, halwa biryani shrikhand puri, decorative brass plate, celebration food photography" },
  ],
  south: [
    { name: "Masala Dosa", price: "₹130", desc: "Crispy rice-lentil crepe filled with spiced potato masala, served with chutneys", tags: ["Popular"], prompt: "Masala dosa crispy golden crepe on white plate, potato filling visible, sambar bowl coconut chutney, South Indian food photography" },
    { name: "Idli Sambar", price: "₹90", desc: "Steamed rice cakes served with piping hot sambar and coconut chutney", tags: ["Mild","Popular"], prompt: "Idli sambar on plate, soft white idlis with small sambar bowl and coconut chutney, South Indian breakfast food photography, banana leaf" },
    { name: "Uttapam", price: "₹110", desc: "Thick savoury rice pancake topped with onion, tomato, chilli and coriander", tags: ["Mild"], prompt: "Uttapam thick pancake with colorful vegetable toppings onion tomato green chilli, South Indian food photography" },
    { name: "Vada Sambar", price: "₹100", desc: "Crunchy lentil doughnuts dunked in aromatic vegetable sambar", tags: ["Popular","Spicy"], prompt: "Medu vada in bowl of sambar, golden crispy lentil doughnuts, South Indian food photography, steam" },
    { name: "Rava Dosa", price: "₹120", desc: "Paper-thin crispy semolina crepe with onions and jeera, lacy and delicate", tags: ["New"], prompt: "Rava dosa ultra thin crispy lacy crepe on plate, golden brown, with chutneys, food photography" },
    { name: "Bisi Bele Bath", price: "₹160", desc: "Karnataka's beloved hot and spicy rice-lentil dish with vegetables and ghee", tags: ["Spicy","Popular"], prompt: "Bisi bele bath in clay bowl, hot steaming Karnataka dish, ghee drizzle, papad on side, food photography" },
  ],
  sweets: [
    { name: "Gulab Jamun", price: "₹80", desc: "Soft milk-solid dumplings soaked in rose-cardamom sugar syrup — served warm", tags: ["Popular"], prompt: "Gulab jamun in syrup in small bowl, dark golden dumplings glistening, rose petals, Indian dessert food photography" },
    { name: "Rasmalai", price: "₹110", desc: "Delicate chenna patties floating in saffron-pistachio rabdi", tags: ["Popular"], prompt: "Rasmalai in shallow bowl, soft white discs in saffron milk, pistachio garnish, Indian dessert food photography" },
    { name: "Kheer", price: "₹90", desc: "Slow-cooked rice pudding with cardamom, saffron and toasted nuts", tags: ["Mild"], prompt: "Kheer rice pudding in clay pot, creamy white with saffron swirl, almond and pistachio, Indian dessert photography" },
    { name: "Mango Lassi", price: "₹80", desc: "Thick chilled yoghurt blended with Alphonso mango pulp and a hint of cardamom", tags: ["Popular"], prompt: "Mango lassi in tall glass, vibrant yellow orange mango yoghurt drink, garnished mango slice, Indian drink food photography" },
    { name: "Masala Chaas", price: "₹50", desc: "Spiced buttermilk with roasted cumin, ginger and fresh coriander", tags: ["Mild"], prompt: "Masala chaas buttermilk in glass, pale yellow with green coriander garnish, Indian drink photography" },
    { name: "Filter Coffee", price: "₹60", desc: "Authentic South Indian decoction coffee served in a traditional tumbler-dabarah", tags: ["Popular"], prompt: "South Indian filter coffee in traditional steel tumbler and dabarah, dark brown frothy coffee, overhead food photography" },
  ],
};

const TAG_STYLES = {
  Popular: { bg: "rgba(74,140,63,0.2)", color: "#7dcf70", border: "rgba(74,140,63,0.3)" },
  Spicy:   { bg: "rgba(232,117,26,0.2)", color: "#E8751A", border: "rgba(232,117,26,0.3)" },
  Mild:    { bg: "rgba(90,180,170,0.15)", color: "#7dd6d0", border: "rgba(90,180,170,0.3)" },
  New:     { bg: "rgba(242,167,13,0.2)", color: "#F2A70D", border: "rgba(242,167,13,0.3)" },
  "Best Value": { bg: "rgba(201,151,58,0.2)", color: "#C9973A", border: "rgba(201,151,58,0.3)" },
};

// ── AI Image fetch ────────────────────────────────────────────────────────────
const imageCache = {};
async function generateDishImage(prompt) {
  if (imageCache[prompt]) return imageCache[prompt];
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Generate a vivid description of this dish photo as an SVG food illustration that looks like a realistic food photo rendering: ${prompt}. 
          
          Return ONLY a complete SVG element (starting with <svg and ending with </svg>) that realistically illustrates the dish. Make it colorful, detailed and appetizing. Use gradients, shapes and realistic food colors. No explanation, just the SVG code.`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || "").join("") || "";
    const svgMatch = text.match(/<svg[\s\S]*<\/svg>/i);
    if (svgMatch) {
      const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMatch[0]);
      imageCache[prompt] = dataUrl;
      return dataUrl;
    }
  } catch(e) {}
  return null;
}

// ── 3D Floating Dish (CSS + canvas animation) ────────────────────────────────
function FloatingDish3D() {
  const canvasRef = useRef(null);
  const [heroImg, setHeroImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const img = await generateDishImage(
        "Idli vada sambar on one large traditional South Indian plate, banana leaf, two soft white idlis, crispy golden vada, bowl of steaming sambar, coconut chutney, overhead close-up, professional food photography, warm golden lighting, 4k photorealistic"
      );
      setHeroImg(img);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame, t = 0;
    const W = canvas.width = 340, H = canvas.height = 340;

    function drawPlate(t) {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const bobY = Math.sin(t * 0.012) * 14;
      const tiltX = Math.sin(t * 0.008) * 0.08;
      const shadowAlpha = 0.13 + Math.sin(t * 0.012) * 0.05;
      const shadowScaleX = 1 + Math.sin(t * 0.012) * 0.06;

      // Shadow
      ctx.save();
      ctx.translate(cx, cy + 148);
      ctx.scale(shadowScaleX, 0.22);
      ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2);
      const sg = ctx.createRadialGradient(0,0,10,0,0,110);
      sg.addColorStop(0, `rgba(0,0,0,${shadowAlpha})`);
      sg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sg; ctx.fill();
      ctx.restore();

      // Plate base
      ctx.save();
      ctx.translate(cx, cy + bobY);
      ctx.transform(1, tiltX, 0, 1, 0, 0);

      // Banana leaf bg circle
      const leafG = ctx.createRadialGradient(-10,-10,10,0,0,115);
      leafG.addColorStop(0, "#5a9e40");
      leafG.addColorStop(0.6, "#3d7a2a");
      leafG.addColorStop(1, "#2a5a1e");
      ctx.beginPath(); ctx.arc(0, 0, 115, 0, Math.PI*2);
      ctx.fillStyle = leafG; ctx.fill();

      // Leaf vein
      ctx.beginPath(); ctx.moveTo(0,-110); ctx.lineTo(0,110);
      ctx.strokeStyle="rgba(255,255,255,0.08)"; ctx.lineWidth=3; ctx.stroke();
      for(let i=-4;i<=4;i++){
        ctx.beginPath(); ctx.moveTo(0,i*22); ctx.lineTo(i>0?90:-90,i*22+30);
        ctx.strokeStyle="rgba(255,255,255,0.05)"; ctx.lineWidth=1.5; ctx.stroke();
      }

      // Plate rim
      ctx.beginPath(); ctx.arc(0, 0, 115, 0, Math.PI*2);
      ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=3; ctx.stroke();

      // ── Idli 1 ──
      function drawIdli(ox, oy) {
        ctx.save(); ctx.translate(ox, oy);
        const ig = ctx.createRadialGradient(-5,-5,2,0,0,26);
        ig.addColorStop(0,"#fff8f0"); ig.addColorStop(0.7,"#f0e8d8"); ig.addColorStop(1,"#e0d0c0");
        ctx.beginPath();
        ctx.ellipse(0, 0, 28, 18, 0, 0, Math.PI*2);
        ctx.fillStyle=ig; ctx.fill();
        ctx.strokeStyle="rgba(180,140,100,0.4)"; ctx.lineWidth=1; ctx.stroke();
        // texture dots
        for(let d=0;d<5;d++){
          const dx=(d%3-1)*8, dy=(Math.floor(d/3)-0.5)*7;
          ctx.beginPath(); ctx.arc(dx,dy,1.5,0,Math.PI*2);
          ctx.fillStyle="rgba(200,160,120,0.3)"; ctx.fill();
        }
        ctx.restore();
      }
      drawIdli(-42, -30);
      drawIdli(-10, -38);

      // ── Vada ──
      ctx.save(); ctx.translate(35, -25);
      const vg = ctx.createRadialGradient(0,0,4,0,0,24);
      vg.addColorStop(0,"#c87820"); vg.addColorStop(0.5,"#b06010"); vg.addColorStop(1,"#7a3e08");
      ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2);
      ctx.fillStyle=vg; ctx.fill();
      // hole
      ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2);
      ctx.fillStyle="#5a9e40"; ctx.fill();
      // crispy texture ring
      for(let a=0;a<12;a++){
        const ang=a*Math.PI/6, r=17;
        ctx.beginPath(); ctx.arc(Math.cos(ang)*r, Math.sin(ang)*r, 2.5, 0, Math.PI*2);
        ctx.fillStyle="rgba(80,40,10,0.25)"; ctx.fill();
      }
      ctx.restore();

      // ── Sambar bowl ──
      ctx.save(); ctx.translate(-15, 45);
      // bowl shadow
      ctx.beginPath(); ctx.ellipse(0,5,34,10,0,0,Math.PI*2);
      ctx.fillStyle="rgba(0,0,0,0.12)"; ctx.fill();
      // bowl
      const bwg = ctx.createLinearGradient(-30,-10,30,30);
      bwg.addColorStop(0,"#e8d5b0"); bwg.addColorStop(1,"#c8a870");
      ctx.beginPath();
      ctx.moveTo(-32,0); ctx.bezierCurveTo(-32,-18,32,-18,32,0);
      ctx.bezierCurveTo(32,20,-32,20,-32,0);
      ctx.fillStyle=bwg; ctx.fill();
      ctx.strokeStyle="rgba(150,100,50,0.5)"; ctx.lineWidth=1.5; ctx.stroke();
      // sambar liquid
      const sg2 = ctx.createRadialGradient(0,-2,4,0,0,26);
      sg2.addColorStop(0,"#c85820"); sg2.addColorStop(0.6,"#a84010"); sg2.addColorStop(1,"#903010");
      ctx.beginPath();
      ctx.moveTo(-28,0); ctx.bezierCurveTo(-28,-12,28,-12,28,0);
      ctx.bezierCurveTo(28,8,-28,8,-28,0);
      ctx.fillStyle=sg2; ctx.fill();
      // steam
      for(let s=0;s<3;s++){
        const sx=-10+s*10, st=t*0.03+s*0.8;
        ctx.beginPath();
        ctx.moveTo(sx,-12);
        ctx.quadraticCurveTo(sx+Math.sin(st)*6,-22,sx+Math.sin(st+1)*4,-32);
        ctx.strokeStyle=`rgba(255,255,255,${0.25-s*0.05})`; ctx.lineWidth=2; ctx.stroke();
      }
      ctx.restore();

      // ── Chutney dot ──
      ctx.save(); ctx.translate(58, 40);
      const cg = ctx.createRadialGradient(-2,-2,1,0,0,16);
      cg.addColorStop(0,"#90d060"); cg.addColorStop(1,"#408020");
      ctx.beginPath(); ctx.arc(0,0,16,0,Math.PI*2);
      ctx.fillStyle=cg; ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=1; ctx.stroke();
      ctx.restore();

      // Curry leaf garnish
      for(let l=0;l<4;l++){
        const la = l*0.7 - 0.5, lr=85+l*5;
        ctx.save(); ctx.translate(Math.cos(la+2)*lr, Math.sin(la+2)*lr*0.6);
        ctx.rotate(la+1);
        ctx.beginPath(); ctx.ellipse(0,0,6,3,0,0,Math.PI*2);
        ctx.fillStyle="#2d7a18"; ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // plate
    }

    function loop() { t++; drawPlate(t); frame = requestAnimationFrame(loop); }
    loop();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{
      position:"relative", display:"flex",
      flexDirection:"column", alignItems:"center", gap:"12px"
    }}>
      {/* 3D canvas dish */}
      <div style={{
        position:"relative",
        filter:"drop-shadow(0 30px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(232,117,26,0.25))",
      }}>
        <canvas ref={canvasRef} style={{ display:"block", borderRadius:"50%" }} />
        {/* glow ring */}
        <div style={{
          position:"absolute", inset:-8, borderRadius:"50%",
          border:"1px solid rgba(232,117,26,0.3)",
          animation:"pulseRing 3s ease-in-out infinite",
          pointerEvents:"none"
        }}/>
        <div style={{
          position:"absolute", inset:-18, borderRadius:"50%",
          border:"1px dashed rgba(201,151,58,0.15)",
          animation:"pulseRing 3s 1s ease-in-out infinite",
          pointerEvents:"none"
        }}/>
      </div>
      {/* label */}
      <div style={{
        background:"rgba(232,117,26,0.15)", border:"1px solid rgba(232,117,26,0.3)",
        color:"#F2A70D", fontSize:"0.65rem", letterSpacing:"2px",
        textTransform:"uppercase", padding:"5px 16px", fontWeight:600
      }}>
        🌿 Idli · Vada · Sambar
      </div>
    </div>
  );
}

// ── Menu Card with AI photo ───────────────────────────────────────────────────
function DishCard({ dish, visible }) {
  const [img, setImg] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setImgLoading(true);
    generateDishImage(dish.prompt).then(url => {
      setImg(url); setImgLoading(false);
    });
  }, [visible, dish.prompt]);

  return (
    <div style={{
      background:"rgba(255,255,255,0.04)",
      border:"1px solid rgba(201,151,58,0.12)",
      transition:"all 0.3s",
      overflow:"hidden",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background="rgba(255,255,255,0.08)";
      e.currentTarget.style.borderColor="rgba(201,151,58,0.28)";
      e.currentTarget.style.transform="translateY(-4px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background="rgba(255,255,255,0.04)";
      e.currentTarget.style.borderColor="rgba(201,151,58,0.12)";
      e.currentTarget.style.transform="translateY(0)";
    }}>
      {/* Photo */}
      <div style={{
        height:"160px", background:"linear-gradient(135deg,#1a0a05,#3a1808)",
        overflow:"hidden", position:"relative", display:"flex",
        alignItems:"center", justifyContent:"center"
      }}>
        {imgLoading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{
              width:28, height:28, border:"2px solid rgba(232,117,26,0.3)",
              borderTopColor:"#E8751A", borderRadius:"50%",
              animation:"spin 0.8s linear infinite"
            }}/>
            <span style={{ color:"rgba(253,246,236,0.3)", fontSize:"0.6rem", letterSpacing:2 }}>PREPARING…</span>
          </div>
        )}
        {img && (
          <img src={img} alt={dish.name} style={{
            width:"100%", height:"100%", objectFit:"cover",
            transition:"transform 0.5s"
          }}
          onMouseEnter={e => e.target.style.transform="scale(1.07)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}
          />
        )}
        {!imgLoading && !img && (
          <span style={{ fontSize:"2.5rem", opacity:0.4 }}>🍽️</span>
        )}
        <div style={{
          position:"absolute", top:8, right:8,
          width:12, height:12, border:"1.5px solid #2D5A27",
          borderRadius:"50%", background:"transparent",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#4A8C3F" }}/>
        </div>
      </div>
      {/* Info */}
      <div style={{ padding:"1rem 1.1rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
          <span style={{
            fontFamily:"'Playfair Display',serif", fontSize:"1rem",
            color:"#FAF0DC", fontWeight:500, flex:1, paddingRight:8
          }}>{dish.name}</span>
          <span style={{
            fontFamily:"'Playfair Display',serif", fontSize:"1.05rem",
            color:"#F2A70D", fontWeight:700, whiteSpace:"nowrap"
          }}>{dish.price}</span>
        </div>
        <p style={{ color:"rgba(253,246,236,0.45)", fontSize:"0.76rem", lineHeight:1.7, fontWeight:300 }}>{dish.desc}</p>
        <div style={{ display:"flex", gap:5, marginTop:8, flexWrap:"wrap" }}>
          {dish.tags.map(t => (
            <span key={t} style={{
              fontSize:"0.57rem", letterSpacing:"1px", textTransform:"uppercase",
              padding:"2px 8px", fontWeight:600, borderRadius:1,
              background:TAG_STYLES[t]?.bg, color:TAG_STYLES[t]?.color,
              border:`1px solid ${TAG_STYLES[t]?.border}`
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function NandiUtsav() {
  const [activeTab, setActiveTab] = useState("starters");
  const [reservationSent, setReservationSent] = useState(false);
  const tabs = [
    { id:"starters", label:"Starters" },
    { id:"mains", label:"Main Course" },
    { id:"breads", label:"Breads & Rice" },
    { id:"thali", label:"Thali" },
    { id:"south", label:"South Indian" },
    { id:"sweets", label:"Sweets & Drinks" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Raleway:wght@300;400;500;600&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Raleway',sans-serif; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulseRing { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.04); } }
    @keyframes scrollPulse { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
    @keyframes mandalaSpin { to { transform:translate(-50%,-50%) rotate(360deg); } }
    @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-18px) rotate(8deg);} }
    ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#120703; } ::-webkit-scrollbar-thumb { background:#5C3317; border-radius:3px; }
  `;

  return (
    <div style={{ fontFamily:"'Raleway',sans-serif", background:"#FDF6EC", color:"#2C1810", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed", top:0, width:"100%", zIndex:200,
        background:"rgba(44,24,16,0.97)", backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 5%", height:64,
        borderBottom:"1px solid rgba(201,151,58,0.3)"
      }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:"#F5D78E", letterSpacing:1 }}>
          Nandi <span style={{ color:"#E8751A", fontStyle:"italic" }}>Utsav</span>
        </div>
        <div style={{ display:"flex", gap:"2rem" }}>
          {["About","Menu","Specialties","Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={{
              color:"rgba(253,246,236,0.75)", textDecoration:"none",
              fontSize:"0.75rem", fontWeight:500, letterSpacing:"2px", textTransform:"uppercase"
            }}>{n}</a>
          ))}
        </div>
        <span style={{
          background:"#2D5A27", color:"#fff", fontSize:"0.65rem",
          letterSpacing:1, padding:"4px 10px", borderRadius:2, fontWeight:600
        }}>🌿 Pure Veg</span>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight:"100vh", position:"relative", display:"flex",
        alignItems:"center", justifyContent:"center",
        background:"linear-gradient(160deg,#1a0a05 0%,#2C1810 45%,#1e0d06 100%)",
        overflow:"hidden", paddingTop:64
      }}>
        {/* bg glows */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse at 15% 50%,rgba(232,117,26,0.15) 0%,transparent 55%), radial-gradient(ellipse at 85% 30%,rgba(242,167,13,0.1) 0%,transparent 50%), radial-gradient(ellipse at 50% 90%,rgba(45,90,39,0.12) 0%,transparent 45%)"
        }}/>
        {/* mandala rings */}
        {[600,860].map((s,i) => (
          <div key={i} style={{
            position:"absolute", width:s, height:s, borderRadius:"50%",
            border:`1px ${i===1?"dashed":"solid"} rgba(201,151,58,${i===0?0.1:0.06})`,
            top:"50%", left:"50%",
            animation:`mandalaSpin ${i===0?60:90}s linear infinite ${i===1?"reverse":""}`,
            pointerEvents:"none"
          }}/>
        ))}
        {/* leaf decors */}
        {["🍃","🌿","🍂","🌱"].map((e,i) => (
          <span key={i} style={{
            position:"absolute", fontSize:"3rem", opacity:0.07, pointerEvents:"none",
            animation:`float ${7+i}s ease-in-out infinite`, animationDelay:`${i*1.5}s`,
            top:["15%","22%","auto","auto"][i], bottom:[null,null,"18%","28%"][i],
            left:["7%",null,"10%",null][i], right:[null,"9%",null,"7%"][i],
          }}>{e}</span>
        ))}

        {/* Hero content — split layout */}
        <div style={{
          position:"relative", zIndex:2,
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"5rem", flexWrap:"wrap", padding:"0 5%", maxWidth:1200, margin:"0 auto"
        }}>
          {/* Text left */}
          <div style={{ textAlign:"center", maxWidth:480 }}>
            <p style={{
              color:"#F2A70D", fontSize:"0.7rem", letterSpacing:"4px",
              textTransform:"uppercase", fontWeight:600, marginBottom:"1.2rem",
              animation:"fadeUp 0.8s 0.3s both"
            }}>Pure Vegetarian · Authentic Flavours</p>
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(2.8rem,6vw,5.5rem)", fontWeight:900,
              color:"#FAF0DC", lineHeight:1.05, marginBottom:5,
              animation:"fadeUp 0.8s 0.5s both"
            }}>
              Nandi Utsav
              <em style={{
                fontStyle:"italic", color:"#E8751A", display:"block",
                fontSize:"0.5em", fontWeight:400, letterSpacing:3, marginTop:6
              }}>The Celebration of Taste</em>
            </h1>
            <div style={{
              width:70, height:2,
              background:"linear-gradient(to right,transparent,#C9973A,transparent)",
              margin:"1.4rem auto",
              animation:"fadeUp 0.8s 0.7s both"
            }}/>
            <p style={{
              color:"rgba(253,246,236,0.6)", fontSize:"0.92rem", letterSpacing:1,
              fontWeight:300, lineHeight:1.85, animation:"fadeUp 0.8s 0.9s both"
            }}>Where every meal is a sacred celebration of India's finest vegetarian culinary heritage</p>
            <div style={{
              display:"flex", gap:"1rem", marginTop:"2.2rem", justifyContent:"center",
              flexWrap:"wrap", animation:"fadeUp 0.8s 1.1s both"
            }}>
              <a href="#menu" style={{
                background:"#E8751A", color:"#fff", padding:"12px 28px",
                textDecoration:"none", fontSize:"0.72rem", fontWeight:700,
                letterSpacing:"2px", textTransform:"uppercase",
                transition:"background 0.3s, transform 0.2s"
              }}>Explore Menu</a>
              <a href="#contact" style={{
                border:"1px solid rgba(201,151,58,0.45)", color:"#F5D78E",
                padding:"12px 28px", textDecoration:"none",
                fontSize:"0.72rem", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase"
              }}>Reserve a Table</a>
            </div>
          </div>

          {/* 3D dish right */}
          <div style={{ animation:"fadeUp 0.8s 0.6s both" }}>
            <FloatingDish3D />
          </div>
        </div>

        {/* scroll hint */}
        <div style={{
          position:"absolute", bottom:"1.8rem", left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:6,
          animation:"fadeUp 1s 1.6s both"
        }}>
          <span style={{ color:"rgba(253,246,236,0.3)", fontSize:"0.58rem", letterSpacing:2, textTransform:"uppercase" }}>Scroll</span>
          <div style={{ width:1, height:36, background:"linear-gradient(to bottom,rgba(201,151,58,0.5),transparent)", animation:"scrollPulse 2s ease-in-out infinite" }}/>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{
        padding:"80px 5%", background:"#FAF0DC",
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"center"
      }}>
        <div style={{ position:"relative" }}>
          <div style={{
            aspectRatio:"4/3",
            background:"linear-gradient(135deg,#3a1a0a,#5C3317)",
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden", position:"relative"
          }}>
            <div style={{
              position:"absolute", inset:0,
              background:"radial-gradient(ellipse at 30% 40%,rgba(232,117,26,0.3) 0%,transparent 60%)"
            }}/>
            <div style={{ textAlign:"center", position:"relative", zIndex:1, padding:"2rem" }}>
              <span style={{ fontSize:"4.5rem", display:"block", marginBottom:"1rem" }}>🪔</span>
              <p style={{
                fontFamily:"'Playfair Display',serif", color:"#F5D78E",
                fontSize:"1.3rem", fontStyle:"italic", lineHeight:1.5
              }}>"Food is our way of expressing devotion to the divine art of taste"</p>
            </div>
          </div>
          <div style={{
            position:"absolute", bottom:-18, right:-18, width:85, height:85,
            background:"#E8751A", borderRadius:"50%",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            color:"#fff", fontFamily:"'Playfair Display',serif"
          }}>
            <span style={{ fontSize:"1.5rem", fontWeight:700, lineHeight:1 }}>10+</span>
            <span style={{ fontSize:"0.52rem", letterSpacing:1 }}>Years</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize:"0.65rem", letterSpacing:"4px", textTransform:"uppercase", color:"#E8751A", fontWeight:600, marginBottom:"0.7rem" }}>Our Story</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:700, color:"#2C1810", lineHeight:1.2 }}>A Tradition of Pure, Joyful Vegetarian Cooking</h2>
          <div style={{ width:50, height:2, background:"linear-gradient(to right,#C9973A,#F2A70D)", margin:"1rem 0 2rem" }}/>
          <p style={{ color:"#5C3317", fontSize:"0.93rem", lineHeight:1.9, fontWeight:300, marginBottom:"1.1rem" }}>Founded with a deep reverence for India's vegetarian culinary traditions, Nandi Utsav brings you the soul of authentic flavours — crafted with love, served with joy.</p>
          <p style={{ color:"#5C3317", fontSize:"0.93rem", lineHeight:1.9, fontWeight:300, marginBottom:"1.5rem" }}>Every recipe is a celebration, every ingredient thoughtfully chosen, every dish cooked fresh daily. From creamy North Indian gravies to crispy South Indian snacks, our kitchen is your home.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}>
            {[["100%","Pure Veg"],["80+","Menu Items"],["500+","Daily Guests"]].map(([n,l]) => (
              <div key={l} style={{ background:"#FDF6EC", padding:"1.1rem", textAlign:"center", borderTop:"2px solid #E8751A" }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.9rem", fontWeight:900, color:"#E8751A", display:"block" }}>{n}</span>
                <span style={{ fontSize:"0.62rem", letterSpacing:1, textTransform:"uppercase", color:"#5C3317", fontWeight:600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU ── */}
      <section id="menu" style={{
        padding:"80px 5%", background:"#2C1810", position:"relative", overflow:"hidden"
      }}>
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse at 10% 20%,rgba(232,117,26,0.07) 0%,transparent 50%)"
        }}/>
        <p style={{ fontSize:"0.65rem", letterSpacing:"4px", textTransform:"uppercase", color:"#F2A70D", fontWeight:600, marginBottom:"0.7rem" }}>Our Offerings</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", color:"#FAF0DC", fontWeight:700, marginBottom:"0.5rem" }}>The Menu</h2>
        <div style={{ width:50, height:2, background:"linear-gradient(to right,#C9973A,#F2A70D)", margin:"1rem 0 2rem" }}/>

        {/* Tabs */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginBottom:"2.5rem" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding:"8px 20px",
              background: activeTab===tab.id ? "#E8751A" : "transparent",
              border: activeTab===tab.id ? "1px solid #E8751A" : "1px solid rgba(201,151,58,0.25)",
              color: activeTab===tab.id ? "#fff" : "rgba(253,246,236,0.5)",
              fontFamily:"'Raleway',sans-serif", fontSize:"0.72rem",
              letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer",
              fontWeight:600, transition:"all 0.3s"
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",
          gap:"1.2rem"
        }}>
          {DISHES[activeTab].map(dish => (
            <DishCard key={dish.name} dish={dish} visible={true} />
          ))}
        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section id="specialties" style={{ padding:"80px 5%", background:"#FDF6EC" }}>
        <div style={{ textAlign:"center", maxWidth:540, margin:"0 auto 3rem" }}>
          <p style={{ fontSize:"0.65rem", letterSpacing:"4px", textTransform:"uppercase", color:"#E8751A", fontWeight:600, marginBottom:"0.7rem" }}>Why Choose Us</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:"#2C1810" }}>The Nandi Utsav Promise</h2>
          <div style={{ width:50, height:2, background:"linear-gradient(to right,#C9973A,#F2A70D)", margin:"1rem auto 0" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1.5rem" }}>
          {[
            ["🌿","100% Pure Veg","A completely vegetarian kitchen — no eggs, no meat, no compromise. Only pure, sattvic ingredients."],
            ["🪔","Traditional Recipes","Recipes passed through generations, cooked the way your grandmother would — with patience and love."],
            ["🌾","Fresh Daily","Every dish is prepared fresh each morning using locally sourced seasonal produce."],
            ["🍛","Regional Diversity","From Rajasthani thalis to Karnataka specials — a true utsav of India's vegetarian diversity."],
            ["🫙","No Preservatives","Zero artificial preservatives, colours or flavour enhancers — just honest ingredients."],
            ["🤝","Warm Hospitality","Every guest is family. We serve with the warmth and care of an Indian home kitchen."],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{
              background:"#FAF0DC", padding:"1.8rem 1.4rem", textAlign:"center",
              borderBottom:"3px solid transparent", transition:"all 0.3s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor="#E8751A";
              e.currentTarget.style.transform="translateY(-5px)";
              e.currentTarget.style.boxShadow="0 15px 40px rgba(44,24,16,0.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor="transparent";
              e.currentTarget.style.transform="translateY(0)";
              e.currentTarget.style.boxShadow="none";
            }}>
              <span style={{ fontSize:"2.2rem", display:"block", marginBottom:"0.8rem" }}>{icon}</span>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", color:"#2C1810", marginBottom:"0.5rem" }}>{title}</h3>
              <p style={{ fontSize:"0.76rem", color:"#5C3317", lineHeight:1.7, fontWeight:300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INFO STRIP ── */}
      <div style={{
        background:"#E8751A", padding:"40px 5%",
        display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
        gap:"2rem", textAlign:"center"
      }}>
        {[["🕐","Opening Hours","7:00 AM – 10:30 PM"],["📍","Location","Bangalore, Karnataka"],["📞","Reservations","+91 98765 43210"],["🚗","Parking","Free Parking Available"]].map(([ic,lb,vl]) => (
          <div key={lb} style={{ color:"#fff" }}>
            <span style={{ fontSize:"1.7rem", display:"block", marginBottom:"0.4rem" }}>{ic}</span>
            <span style={{ fontSize:"0.58rem", letterSpacing:2, textTransform:"uppercase", opacity:0.75, fontWeight:600, display:"block", marginBottom:"0.25rem" }}>{lb}</span>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontWeight:600 }}>{vl}</span>
          </div>
        ))}
      </div>

      {/* ── CONTACT ── */}
      <section id="contact" style={{
        padding:"80px 5%", background:"#2C1810",
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem"
      }}>
        <div>
          <p style={{ fontSize:"0.65rem", letterSpacing:"4px", textTransform:"uppercase", color:"#F2A70D", fontWeight:600, marginBottom:"0.7rem" }}>Find Us</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,3vw,2.6rem)", color:"#FAF0DC", fontWeight:700 }}>Visit Nandi Utsav</h2>
          <div style={{ width:50, height:2, background:"linear-gradient(to right,#C9973A,#F2A70D)", margin:"1rem 0 1.5rem" }}/>
          <p style={{ color:"rgba(253,246,236,0.55)", fontSize:"0.9rem", lineHeight:1.8, fontWeight:300, marginBottom:"1.5rem" }}>Come dine with us and experience the warmth of pure vegetarian hospitality. We welcome families, groups and solo diners alike.</p>
          {[["📍","Address","12, Utsav Nagar, Near Nandi Temple, Bangalore – 560001"],["📞","Phone","+91 98765 43210"],["🕐","Hours","Mon–Sun · 7:00 AM – 10:30 PM"],["📧","Email","hello@nandiutsav.in"]].map(([ic,lb,vl]) => (
            <div key={lb} style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(201,151,58,0.1)" }}>
              <div style={{ width:40, height:40, background:"rgba(232,117,26,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{ic}</div>
              <div>
                <span style={{ fontSize:"0.58rem", letterSpacing:2, textTransform:"uppercase", color:"#C9973A", fontWeight:600, display:"block" }}>{lb}</span>
                <span style={{ color:"#FAF0DC", fontSize:"0.92rem" }}>{vl}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,151,58,0.15)", padding:"2rem" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", color:"#FAF0DC", fontSize:"1.5rem", marginBottom:"0.4rem" }}>Reserve a Table</h3>
          <p style={{ color:"rgba(253,246,236,0.45)", fontSize:"0.78rem", marginBottom:"1.5rem" }}>Book your table in advance for a seamless dining experience</p>
          {reservationSent ? (
            <div style={{ textAlign:"center", padding:"2rem 0" }}>
              <span style={{ fontSize:"3rem", display:"block", marginBottom:"1rem" }}>🙏</span>
              <p style={{ color:"#F2A70D", fontFamily:"'Playfair Display',serif", fontSize:"1.2rem" }}>Table Reserved!</p>
              <p style={{ color:"rgba(253,246,236,0.5)", fontSize:"0.8rem", marginTop:"0.5rem" }}>We will confirm your booking shortly.</p>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem", marginBottom:"0.8rem" }}>
                {[["Your Name","text","Full name"],["Phone","tel","+91 00000 00000"]].map(([lb,type,ph]) => (
                  <div key={lb}>
                    <label style={{ fontSize:"0.62rem", letterSpacing:2, textTransform:"uppercase", color:"#C9973A", fontWeight:600, display:"block", marginBottom:"0.35rem" }}>{lb}</label>
                    <input type={type} placeholder={ph} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(201,151,58,0.2)", color:"#FAF0DC", padding:"9px 12px", fontFamily:"'Raleway',sans-serif", fontSize:"0.83rem", outline:"none" }}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem", marginBottom:"0.8rem" }}>
                {[["Date","date"],["Time","time"]].map(([lb,type]) => (
                  <div key={lb}>
                    <label style={{ fontSize:"0.62rem", letterSpacing:2, textTransform:"uppercase", color:"#C9973A", fontWeight:600, display:"block", marginBottom:"0.35rem" }}>{lb}</label>
                    <input type={type} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(201,151,58,0.2)", color:"#FAF0DC", padding:"9px 12px", fontFamily:"'Raleway',sans-serif", fontSize:"0.83rem", outline:"none" }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:"0.8rem" }}>
                <label style={{ fontSize:"0.62rem", letterSpacing:2, textTransform:"uppercase", color:"#C9973A", fontWeight:600, display:"block", marginBottom:"0.35rem" }}>Guests</label>
                <select style={{ width:"100%", background:"#2C1810", border:"1px solid rgba(201,151,58,0.2)", color:"#FAF0DC", padding:"9px 12px", fontFamily:"'Raleway',sans-serif", fontSize:"0.83rem", outline:"none" }}>
                  {["1 Person","2 People","4 People","6 People","8+ People (Group)"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ fontSize:"0.62rem", letterSpacing:2, textTransform:"uppercase", color:"#C9973A", fontWeight:600, display:"block", marginBottom:"0.35rem" }}>Special Requests</label>
                <textarea rows={3} placeholder="Allergies, occasion, seating preference..." style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(201,151,58,0.2)", color:"#FAF0DC", padding:"9px 12px", fontFamily:"'Raleway',sans-serif", fontSize:"0.83rem", outline:"none", resize:"none" }}/>
              </div>
              <button onClick={() => setReservationSent(true)} style={{
                width:"100%", background:"#E8751A", color:"#fff", border:"none",
                padding:"13px", fontFamily:"'Raleway',sans-serif", fontSize:"0.72rem",
                fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer"
              }}>Confirm Reservation</button>
            </>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background:"#120703", padding:"40px 5% 24px",
        textAlign:"center", borderTop:"1px solid rgba(201,151,58,0.1)"
      }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.7rem", color:"#F5D78E", marginBottom:"0.4rem" }}>
          Nandi <em style={{ color:"#E8751A", fontStyle:"italic" }}>Utsav</em>
        </div>
        <p style={{ color:"rgba(253,246,236,0.3)", fontSize:"0.7rem", letterSpacing:2, textTransform:"uppercase", marginBottom:"1.5rem" }}>Pure Vegetarian · Authentic Flavours · Bangalore</p>
        <div style={{ display:"flex", justifyContent:"center", gap:"2rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
          {["About","Menu","Specialties","Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={{ color:"rgba(253,246,236,0.35)", textDecoration:"none", fontSize:"0.7rem", letterSpacing:1, textTransform:"uppercase" }}>{n}</a>
          ))}
        </div>
        <div style={{ color:"rgba(253,246,236,0.18)", fontSize:"0.68rem", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:"1.2rem" }}>
          © 2024 Nandi Utsav Restaurant. All rights reserved. · Made with 🪔 in Bangalore
        </div>
      </footer>
    </div>
  );
}
