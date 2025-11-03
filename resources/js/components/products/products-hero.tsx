import { Music, Disc3 } from "lucide-react";

export function ProductsHero() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Floating Vinyl Records */}
      <div className="absolute top-10 left-10 animate-spin-slow">
        <Disc3 className="h-20 w-20 text-amber-500/10" />
      </div>
      <div className="absolute top-20 right-10 animate-spin-reverse">
        <Disc3 className="h-16 w-16 text-amber-500/5" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
            <Music className="h-8 w-8" />
          </div>
          Sản phẩm
        </h1>
        <p className="text-slate-200 drop-shadow">
          Khám phá bộ sưu tập đĩa than chính hãng của chúng tôi.
        </p>
      </div>
    </div>
  );
}
