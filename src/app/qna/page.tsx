import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QnAPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Q&A</h1>
            <p className="text-gray-600">문의사항이 있으시면 아래 연락처로 문의해 주세요</p>
          </div>

          {/* 안내 카드 */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 md:p-12">
            <div className="space-y-8">
              {/* 안내 문구 */}
              <div className="text-center pb-6 border-b border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed">
                  학습 관련 문의사항, 교재 정오 및 오타 제보,<br className="hidden sm:inline" />
                  저작권 침해 신고 등은 아래 연락처로 문의해 주세요.
                </p>
              </div>

              {/* 연락처 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 카카오톡 - 클릭 가능 */}
                <a
                  href="http://pf.kakao.com/_xdHxixj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                  <div className="text-6xl">💬</div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700 mb-1">KakaoTalk</div>
                    <div className="text-lg font-bold text-gray-900">VERADI</div>
                  </div>
                </a>

                {/* 이메일 - 텍스트만 */}
                <div className="flex flex-col items-center gap-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-6xl">✉️</div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Email</div>
                    <div className="text-lg font-bold text-gray-900 break-all">
                      veradicontents@gmail.com
                    </div>
                  </div>
                </div>
              </div>

              {/* 추가 안내 */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  문의 시 상세한 내용을 함께 남겨 주시면<br className="sm:hidden" /> 보다 신속하고 정확한 답변이 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

