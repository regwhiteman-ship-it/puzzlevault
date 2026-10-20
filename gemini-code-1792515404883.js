import React, { useState } from "react";
import {
  Package,
  ShieldCheck,
  Search,
  Plus,
  Heart,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
  AlertCircle,
  QrCode,
  Tag,
  Boxes,
  HelpCircle,
  SlidersHorizontal,
  ArrowRight,
  Check
} from "lucide-react";

// --- MOCK INITIAL PUZZLE LISTINGS ---
const INITIAL_PUZZLES = [
  {
    id: "p1",
    title: "Ravensburger Country Cottage",
    brand: "Ravensburger",
    pieces: 1000,
    condition: "100% Complete",
    completenessCode: "COMPLETE",
    price: 14.50,
    theme: "Cozy & Country",
    seller: "Sarah_Puzzles",
    rating: 4.9,
    reviewsCount: 28,
    smokeFree: true,
    petFree: true,
    image: "https://images.unsplash.com/photo-1585336261026-8f5786372969?auto=format&fit=crop&q=80&w=800",
    description: "Built once during winter. Kept in a sealed zip bag inside the box. Missing zero pieces guaranteed!",
    parcelSize: "Medium",
    likes: 12
  },
  {
    id: "p2",
    title: "Galison Floral All-Stars",
    brand: "Galison",
    pieces: 500,
    condition: "100% Complete",
    completenessCode: "COMPLETE",
    price: 10.00,
    theme: "Art & Botanical",
    seller: "Oliver_Jigsaws",
    rating: 5.0,
    reviewsCount: 14,
    smokeFree: true,
    petFree: false,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    description: "Vibrant art puzzle. Gold foil accents on box. Immaculate condition.",
    parcelSize: "Small",
    likes: 24
  },
  {
    id: "p3",
    title: "Gibson Heritage Railway",
    brand: "Gibsons",
    pieces: 1000,
    condition: "1 Piece Missing (Edge)",
    completenessCode: "MISSING_1",
    price: 6.50,
    theme: "Nostalgia & Travel",
    seller: "RetroCollector",
    rating: 4.7,
    reviewsCount: 52,
    smokeFree: true,
    petFree: true,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800",
    description: "Classic steam train puzzle. Unfortunately 1 sky edge piece went missing during move. Priced accordingly!",
    parcelSize: "Medium",
    likes: 5
  },
  {
    id: "p4",
    title: "Wentworth Wooden Handcrafted Map",
    brand: "Wentworth",
    pieces: 250,
    condition: "100% Complete",
    completenessCode: "COMPLETE",
    price: 28.00,
    theme: "Wooden & Whimsical",
    seller: "WoodlandCrafts",
    rating: 5.0,
    reviewsCount: 41,
    smokeFree: true,
    petFree: true,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    description: "Premium laser-cut wooden puzzle with custom whimsy pieces shaped like animals! Immaculate quality.",
    parcelSize: "Small",
    likes: 48
  }
];

export default function PuzzleVaultApp() {
  const [puzzles, setPuzzles] = useState(INITIAL_PUZZLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPieceFilter, setSelectedPieceFilter] = useState("ALL");
  const [selectedTheme, setSelectedTheme] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [favorites, setFavorites] = useState([]);

  // Modals & Active Flows
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [checkoutPuzzle, setCheckoutPuzzle] = useState(null);
  const [offerPuzzle, setOfferPuzzle] = useState(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Delivery, 2: Payment, 3: Confirmation
  const [selectedCourier, setSelectedCourier] = useState("inpost");

  // New Listing State
  const [newListing, setNewListing] = useState({
    title: "",
    brand: "Ravensburger",
    pieces: 1000,
    condition: "100% Complete",
    price: 12.00,
    theme: "Cozy & Country",
    smokeFree: true,
    petFree: true,
    description: "",
    image: "https://images.unsplash.com/photo-1585336261026-8f5786372969?auto=format&fit=crop&q=80&w=800"
  });

  const calculateParcelSize = (pieces) => {
    if (pieces <= 500) return "Small";
    if (pieces <= 1000) return "Medium";
    return "Large";
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredPuzzles = puzzles.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPiece = selectedPieceFilter === "ALL" || 
                         (selectedPieceFilter === "500" && p.pieces <= 500) ||
                         (selectedPieceFilter === "1000" && p.pieces === 1000) ||
                         (selectedPieceFilter === "1500+" && p.pieces >= 1500);
    const matchesTheme = selectedTheme === "ALL" || p.theme === selectedTheme;
    const matchesBrand = selectedBrand === "ALL" || p.brand === selectedBrand;
    return matchesSearch && matchesPiece && matchesTheme && matchesBrand;
  });

  const handleCreateListing = (e) => {
    e.preventDefault();
    const parcelSize = calculateParcelSize(Number(newListing.pieces));
    const createdItem = {
      id: `p-${Date.now()}`,
      ...newListing,
      pieces: Number(newListing.pieces),
      price: Number(newListing.price),
      parcelSize,
      seller: "You (My Vault)",
      rating: 5.0,
      reviewsCount: 1,
      likes: 0
    };
    setPuzzles([createdItem, ...puzzles]);
    setIsSellModalOpen(false);
    alert("✨ Puzzle listed successfully on PuzzleVault!");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900 font-sans flex flex-col">
      {/* --- HEADER NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-[#007782] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedPuzzle(null)}>
            <div className="w-11 h-11 bg-white text-[#007782] rounded-2xl flex items-center justify-center font-extrabold shadow-inner transform -rotate-2">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight flex items-center gap-1 font-serif">
                PuzzleVault
              </span>
              <p className="text-[10px] text-teal-100 font-medium tracking-wide uppercase">Pre-Loved Jigsaw Marketplace</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by brand (Ravensburger, Galison), theme, or piece count..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#005f68] text-white pl-12 pr-4 py-2.5 rounded-full text-sm border border-teal-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-teal-200"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Sell Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <section className="bg-gradient-to-r from-[#007782] via-[#00606a] to-[#004850] text-white py-8 border-b border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" /> Buy & Sell Pre-Loved Jigsaws
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-serif tracking-tight">
              Clear your shelves. Find your next puzzle challenge.
            </h1>
            <p className="text-teal-100 text-sm md:text-base leading-relaxed">
              Buy complete pre-owned jigsaws with zero seller listing fees, buyer protection guarantees, and low-cost automated drop-off shipping.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-300 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Buyer Protection</h4>
                <p className="text-[11px] text-teal-100">£0.70 + 5% Fee</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <Truck className="w-8 h-8 text-amber-300 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">InPost & Evri</h4>
                <p className="text-[11px] text-teal-100">From £2.60 Locker</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CATALOG & FILTERS --- */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Pieces:
            </span>
            {["ALL", "500", "1000", "1500+"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedPieceFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedPieceFilter === f
                    ? "bg-[#007782] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f === "ALL" ? "All Sizes" : `${f} pcs`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-[#007782]"
              >
                <option value="ALL">All Brands</option>
                <option value="Ravensburger">Ravensburger</option>
                <option value="Galison">Galison</option>
                <option value="Gibsons">Gibsons</option>
                <option value="Wentworth">Wentworth</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Theme:</span>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-[#007782]"
              >
                <option value="ALL">All Themes</option>
                <option value="Cozy & Country">Cozy & Country</option>
                <option value="Art & Botanical">Art & Botanical</option>
                <option value="Nostalgia & Travel">Nostalgia & Travel</option>
                <option value="Wooden & Whimsical">Wooden & Whimsical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPuzzles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setSelectedPuzzle(item)}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-gray-600 hover:text-red-500 transition"
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-black">
                  {item.pieces} pcs
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-bold text-[#007782] uppercase tracking-wide">{item.brand}</span>
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[10px]">
                      <CheckCircle className="w-3 h-3" /> {item.condition}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedPuzzle(item)}
                    className="font-bold text-gray-900 line-clamp-1 hover:text-[#007782] cursor-pointer text-base mb-1"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3">
                    Seller: <span className="font-medium text-gray-700">{item.seller}</span> ({item.rating}★)
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Price</span>
                    <span className="text-xl font-black text-[#007782]">£{item.price.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setCheckoutPuzzle(item)}
                    className="bg-[#007782] hover:bg-[#005f68] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- CHECKOUT MODAL --- */}
      {checkoutPuzzle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#007782] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg font-serif">Checkout</h3>
              <button onClick={() => setCheckoutPuzzle(null)} className="text-teal-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Item Card */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <img src={checkoutPuzzle.image} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{checkoutPuzzle.title}</h4>
                  <p className="text-xs text-gray-500">{checkoutPuzzle.brand} • {checkoutPuzzle.pieces} pcs</p>
                  <span className="text-sm font-black text-[#007782]">£{checkoutPuzzle.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Carrier Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Delivery Carrier</label>
                <div className="space-y-2">
                  {[
                    { id: "inpost", name: "InPost Locker Drop-Off", price: 2.60, time: "2-3 Working Days" },
                    { id: "evri", name: "Evri ParcelShop", price: 2.80, time: "2-4 Working Days" },
                    { id: "royalmail", name: "Royal Mail Tracked 48", price: 3.20, time: "2 Working Days" }
                  ].map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCourier(c.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition ${
                        selectedCourier === c.id ? "border-[#007782] bg-teal-50/50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-xs text-gray-900">{c.name}</h5>
                        <span className="text-[11px] text-gray-500">{c.time}</span>
                      </div>
                      <span className="font-black text-xs text-[#007782]">£{c.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Puzzle Price:</span>
                  <span>£{checkoutPuzzle.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Buyer Protection Fee (£0.70 + 5%):</span>
                  <span>£{(0.70 + checkoutPuzzle.price * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery ({selectedCourier.toUpperCase()}):</span>
                  <span>£{(selectedCourier === "inpost" ? 2.60 : selectedCourier === "evri" ? 2.80 : 3.20).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-sm text-[#007782]">
                  <span>Total Payable:</span>
                  <span>
                    £{(
                      checkoutPuzzle.price +
                      (0.70 + checkoutPuzzle.price * 0.05) +
                      (selectedCourier === "inpost" ? 2.60 : selectedCourier === "evri" ? 2.80 : 3.20)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert("🎉 Order placed successfully! The seller has been notified to drop off the parcel.");
                  setCheckoutPuzzle(null);
                }}
                className="w-full bg-[#007782] hover:bg-[#005f68] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition"
              >
                Pay & Complete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SELL A PUZZLE MODAL --- */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-[#007782] text-white p-5 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg font-serif">List a Jigsaw for Sale</h3>
              <button onClick={() => setIsSellModalOpen(false)} className="text-teal-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Puzzle Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravensburger Country Cottage"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-[#007782]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Galison, Wasgij"
                    value={newListing.brand}
                    onChange={(e) => setNewListing({ ...newListing, brand: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Piece Count</label>
                  <select
                    value={newListing.pieces}
                    onChange={(e) => setNewListing({ ...newListing, pieces: Number(e.target.value) })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl font-bold"
                  >
                    <option value={250}>250 pcs</option>
                    <option value={500}>500 pcs</option>
                    <option value={1000}>1,000 pcs</option>
                    <option value={1500}>1,500 pcs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Completeness Status</label>
                  <select
                    value={newListing.condition}
                    onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl font-bold text-emerald-800"
                  >
                    <option value="100% Complete">100% Complete (Checked)</option>
                    <option value="1 Piece Missing">1 Piece Missing</option>
                    <option value="2+ Pieces Missing">2+ Pieces Missing</option>
                    <option value="Brand New / Sealed">Brand New / Sealed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (£)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Mention box condition or missing piece details..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#007782] hover:bg-[#005f68] text-white py-3 rounded-xl font-bold text-sm shadow-lg transition"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#003d43] text-teal-100 py-8 border-t border-teal-700 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#007782] font-bold">
              <Boxes className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base font-serif">PuzzleVault</span>
          </div>
          <p>© {new Date().getFullYear()} PuzzleVault. The Dedicated Pre-Loved Jigsaw Marketplace.</p>
          <div className="flex gap-4 text-teal-200 font-medium">
            <a href="#" className="hover:text-white">Buyer Protection</a>
            <a href="#" className="hover:text-white">InPost & Evri Drop-Offs</a>
            <a href="#" className="hover:text-white">Seller Terms (0% Fee)</a>
          </div>
        </div>
      </footer>
    </div>
  );
}