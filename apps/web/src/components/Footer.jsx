const Footer = (props) => {
  return (
    <footer className="flex flex-col w-full px-4 py-6 bg-slate-100 gap-3">
      <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-blue-800 font-extrabold text-xl">Cosmo</span>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Blog</span>
            <span className="font-semibold">Discounts</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-blue-800 font-extrabold text-xl">
            Help & Guide
          </span>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">FAQ</span>
            <span className="font-semibold">Help Center</span>
            <span className="font-semibold">User Agreements</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-blue-800 font-extrabold text-xl">
            Follow Us
          </span>
          <div className="flex gap-2">
            <span className="font-semibold">FaceBook</span>
            <span className="font-semibold">Instagram</span>
            <span className="font-semibold">Twitter</span>
          </div>
        </div>
      </div>
      <div className="flex">
        <span>Copyright@{new Date().getFullYear()}, Cosmo</span>
      </div>
    </footer>
  );
};

export default Footer;
