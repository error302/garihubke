export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            Have questions about buying or selling? We&apos;re here to help!
          </p>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">info@garihubke.com</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">+254 700 000 000</p>
            </div>
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-700">
            Our contact form is under development. For now, please reach out via email or phone.
          </p>
        </div>
      </div>
    </div>
  );
}
