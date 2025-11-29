
import React from 'react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop"
          alt="Vinyl Record Player" 
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-serif text-5xl font-bold md:text-6xl">Câu Chuyện Của Chúng Tôi</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">Khôi phục linh hồn của âm nhạc, từng đĩa than một.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="prose prose-lg mx-auto text-gray-600">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Về Rill</h2>
          <p>
            Được thành lập vào năm 2024, <strong>Rill</strong> ra đời từ niềm đam mê sâu sắc với âm thanh analog. Trong một thế giới bị thống trị bởi nhạc số và âm thanh nén, chúng tôi muốn tạo ra một thánh địa cho những người trân trọng nghi thức thả kim lên đĩa than.
          </p>
          <p>
            Chúng tôi chuyên tuyển chọn các đĩa than chất lượng cao, từ những tác phẩm kinh điển vượt thời gian của <em>Trịnh Công Sơn</em> và <em>The Beatles</em> đến những kiệt tác hiện đại của <em>Daft Punk</em>. Mỗi đĩa nhạc trong cửa hàng của chúng tôi đều được lựa chọn dựa trên ý nghĩa âm nhạc và chất lượng bản in.
          </p>
          
          <h3 className="font-serif text-2xl font-bold text-gray-900 mt-12">Sứ Mệnh Của Chúng Tôi</h3>
          <p>
            Chúng tôi tin rằng âm nhạc không chỉ là tiếng ồn nền - đó là một trải nghiệm. Sứ mệnh của chúng tôi là kết nối các audiophile Việt Nam với những đĩa nhạc tốt nhất từ khắp nơi trên thế giới, cung cấp không chỉ một sản phẩm, mà là cầu nối đến ý định thực sự của người nghệ sĩ.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
             <div className="rounded-xl bg-gray-50 p-6">
                <h4 className="mb-2 font-bold text-gray-900">Chính hãng</h4>
                <p className="text-sm">100% nhập khẩu chính ngạch và bản in gốc.</p>
             </div>
             <div className="rounded-xl bg-gray-50 p-6">
                <h4 className="mb-2 font-bold text-gray-900">Chất lượng</h4>
                <p className="text-sm">Kiểm tra tỉ mỉ và đóng gói cao cấp.</p>
             </div>
             <div className="rounded-xl bg-gray-50 p-6">
                <h4 className="mb-2 font-bold text-gray-900">Cộng đồng</h4>
                <p className="text-sm">Xây dựng ngôi nhà cho những người yêu đĩa than tại Việt Nam.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;