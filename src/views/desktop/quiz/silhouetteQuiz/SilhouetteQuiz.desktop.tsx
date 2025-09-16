'use client'

import { Fragment } from 'react'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import SilhouetteQuizBeforeStage from './silhouetteQuiz.before/SilhouetteQuizBeforeStage'
import SilhouetteQuiz from './silhouetteQuiz.quiz/SilhouetteQuiz'

const SilhouetteQuizDesktop = () => {
  const { quizViewStage } = useSilhouetteQuizContext()

  return (
    <Fragment>
      <section className="h-full min-h-screen w-full max-w-[1280px] mx-auto">
        {quizViewStage === 'BEFORE' && <SilhouetteQuizBeforeStage />}
        {quizViewStage === 'QUIZ' && <SilhouetteQuiz />}
      </section>
    </Fragment>
  )

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <HeaderContainer />
  //       <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
  //           <p className="text-gray-600">문제를 불러오는 중...</p>
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  // if (isCompleted && result) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <HeaderContainer />
  //       <main className="container mx-auto px-4 py-8">
  //         <div className="max-w-2xl mx-auto">
  //           <div className="bg-white rounded-lg shadow-lg p-8 text-center">
  //             <div className="mb-6">
  //               <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
  //                 <span className="text-3xl">🎉</span>
  //               </div>
  //               <h1 className="text-3xl font-bold text-gray-800 mb-2">
  //                 실루엣 퀴즈 완료!
  //               </h1>
  //             </div>

  //             <div className="grid grid-cols-2 gap-6 mb-8">
  //               <div className="bg-gray-50 rounded-lg p-4">
  //                 <div className="text-2xl font-bold text-purple-600">
  //                   {result.correctAnswers}
  //                 </div>
  //                 <div className="text-sm text-gray-600">맞은 문제</div>
  //               </div>
  //               <div className="bg-gray-50 rounded-lg p-4">
  //                 <div className="text-2xl font-bold text-purple-600">
  //                   {result.percentage}%
  //                 </div>
  //                 <div className="text-sm text-gray-600">정답률</div>
  //               </div>
  //               <div className="bg-gray-50 rounded-lg p-4">
  //                 <div className="text-2xl font-bold text-purple-600">
  //                   {formatTime(result.totalTime)}
  //                 </div>
  //                 <div className="text-sm text-gray-600">총 시간</div>
  //               </div>
  //               <div className="bg-gray-50 rounded-lg p-4">
  //                 <div className="text-2xl font-bold text-purple-600">
  //                   {formatTime(result.averageTime)}
  //                 </div>
  //                 <div className="text-sm text-gray-600">평균 시간</div>
  //               </div>
  //             </div>

  //             <div className="flex flex-col sm:flex-row gap-4 justify-center">
  //               <button
  //                 onClick={resetQuiz}
  //                 className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
  //               >
  //                 다시 도전하기
  //               </button>
  //               <Link
  //                 href={QUIZ_ROUTES.MAIN}
  //                 className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
  //               >
  //                 다른 퀴즈 해보기
  //               </Link>
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  // if (!currentQuestion) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <HeaderContainer />
  //       <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
  //         <div className="text-center">
  //           <p className="text-gray-600 mb-4">문제를 불러올 수 없습니다.</p>
  //           <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
  //             다시 시도
  //           </button>
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  // return (
  //   <div className="min-h-screen bg-gray-50 pt-30">
  //     <HeaderContainer />

  //     <main className="container mx-auto px-4 py-8">
  //       <div className="max-w-3xl mx-auto">
  //         {/* Header */}
  //         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
  //           <div className="flex items-center justify-between mb-4">
  //             <div>
  //               <h1 className="text-2xl font-bold text-gray-800">
  //                 실루엣 퀴즈
  //               </h1>
  //               <p className="text-gray-600">
  //                 문제 {currentQuestionIndex + 1} / 20
  //               </p>
  //             </div>
  //             <div className="text-right">
  //               <div className="text-lg font-medium text-purple-600">
  //                 {formatTimeShort(timeElapsed)}
  //               </div>
  //               <div className="text-sm text-gray-600">경과 시간</div>
  //             </div>
  //           </div>

  //           <div className="w-full bg-gray-200 rounded-full h-2">
  //             <div
  //               className="bg-purple-600 h-2 rounded-full transition-all duration-300"
  //               style={{ width: `${progress}%` }}
  //             ></div>
  //           </div>
  //         </div>

  //         {/* Question */}
  //         <div className="bg-white rounded-lg shadow-md p-8 mb-6">
  //           <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
  //             {currentQuestion.question}
  //           </h2>
  //           <div className="grid grid-cols-2 gap-4">
  //             {currentQuestion.options.map((option, index) => (
  //               <button
  //                 key={index}
  //                 onClick={() => submitAnswer(index)}
  //                 className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 font-medium"
  //               >
  //                 <span className="inline-block w-6 h-6 bg-gray-100 rounded-full text-center text-sm mr-3">
  //                   {String.fromCharCode(65 + index)}
  //                 </span>
  //                 {option}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         <div className="text-center">
  //           <Link
  //             href={QUIZ_ROUTES.MAIN}
  //             className="text-gray-500 hover:text-gray-700 underline"
  //           >
  //             퀴즈 목록으로 돌아가기
  //           </Link>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // )
}

export default SilhouetteQuizDesktop
