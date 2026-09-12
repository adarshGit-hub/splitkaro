import Link from 'next/link';
import { Receipt, Share2, Smartphone, Shield, Zap, QrCode } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-indigo-600 tracking-tight">SplitKaro</div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/create" className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm">Create Split</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Split bills. Friends just <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">tap & pay via UPI.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            No app installs required for your friends. Just create a split, share the link, and they pay directly via any UPI app with amounts pre-filled.
          </p>
          <Link 
            href="/create" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
          >
            Create a Split — it's free
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500">Three simple steps to settle up</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Create a Split</h3>
              <p className="text-gray-600">Enter the expense details, add your friends, and enter your UPI ID where you want to receive money.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Share the Link</h3>
              <p className="text-gray-600">Send the generated smart link via WhatsApp, Telegram, or any messaging app.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Friends Pay</h3>
              <p className="text-gray-600">Friends open the link (no app needed!) and tap to pay. Their UPI app opens with the exact amount pre-filled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why SplitKaro?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Zap className="w-6 h-6 text-indigo-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">No app install needed</h4>
              <p className="text-gray-600 text-sm">Friends just open the web link on their browser.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Smartphone className="w-6 h-6 text-indigo-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">UPI amount pre-filled</h4>
              <p className="text-gray-600 text-sm">No manual entry mistakes. Exact split amounts are sent to the UPI app.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Receipt className="w-6 h-6 text-indigo-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Live payment status</h4>
              <p className="text-gray-600 text-sm">See who has paid and who is pending in real-time.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <QrCode className="w-6 h-6 text-indigo-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">QR codes for each person</h4>
              <p className="text-gray-600 text-sm">Scan to pay works perfectly for in-person settlements.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Shield className="w-6 h-6 text-indigo-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Privacy first</h4>
              <p className="text-gray-600 text-sm">Money never touches our servers. It goes directly peer-to-peer.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-6 h-6 text-indigo-600 mb-4 font-bold">₹</div>
              <h4 className="font-semibold text-gray-900 mb-2">Free forever</h4>
              <p className="text-gray-600 text-sm">No transaction fees, no premium tiers. Just simple bill splitting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Do my friends need to install SplitKaro?</h4>
              <p className="text-gray-600">No! That's the best part. They just receive a link, open it in their browser, and tap a button to pay via their existing UPI app (GPay, PhonePe, Paytm, etc).</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Does SplitKaro handle my money?</h4>
              <p className="text-gray-600">Never. SplitKaro just generates smart UPI links. The transaction happens directly between your friend's bank account and your bank account via UPI.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Is SplitKaro free?</h4>
              <p className="text-gray-600">Yes, it is completely free to use. We don't charge any platform fees.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h4 className="font-semibold text-gray-900 mb-2">How do I know a payment link is genuine?</h4>
              <p className="text-gray-600">The link will always show the exact UPI ID it's sending money to. When your UPI app opens, it will verify the receiver's name directly with their bank before you enter your PIN.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to split?</h2>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
      
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800 bg-gray-900">
        <p>&copy; {new Date().getFullYear()} SplitKaro. All rights reserved.</p>
      </footer>
    </div>
  );
}
