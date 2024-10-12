import ProfilePopover from "@/components/ProfilePopover";
export default function Connect () {
  return (
    <div className="max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white">
      <img src="/images/MainScreen.png" alt="Whale and coins" className="w-full" />
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Whallet</h1>
        <p className="text-sm text-gray-600 mt-2">
          Empowering kids.
        </p>
        <ProfilePopover />
      </div>
    </div>
  );
};