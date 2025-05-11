
import { useState, useEffect, createRef } from 'react';
import { motion } from 'framer-motion';
import { Chemical } from '../context/SimulationContext';

interface ChemicalBottleProps {
  chemical: Chemical;
  isPouring: boolean;
  onPourComplete: () => void;
  bottleX?: number; // إحداثي X للتحكم اليدوي
  bottleY?: number; // إحداثي Y للتحكم اليدوي
  isReady?: boolean; // لتحديد ما إذا كان التفاعل جاهزًا أو حرًا
}

const ChemicalBottle = ({
  chemical,
  isPouring,
  onPourComplete,
  bottleX,
  bottleY,
  isReady = true, // القيمة الافتراضية هي التفاعلات الجاهزة
}: ChemicalBottleProps) => {
  const [pourProgress, setPourProgress] = useState(0);
  const pouringAudioRef = createRef<HTMLAudioElement>(); // مرجع لصوت السكب

  // دالة لتحديد موقع الزجاجة في التفاعلات الجاهزة
  const getReadyBottlePosition = () => {
    const defaultX = -240; // الزجاجة 240 بكسل إلى اليسار
    const defaultY = -235; // الزجاجة 235 بكسل للأعلى
    return { x: bottleX !== undefined ? bottleX : defaultX, y: bottleY !== undefined ? bottleY : defaultY };
  };

  // دالة لتحديد موقع الزجاجة في التفاعلات الحرة (تغيير القيم الافتراضية)
  const getFreeBottlePosition = () => {
    const defaultX = -210; // الزجاجة 210 بكسل إلى اليسار
    const defaultY = -320; // الزجاجة 320 بكسل للأعلى
    return { x: bottleX !== undefined ? bottleX : defaultX, y: bottleY !== undefined ? bottleY : defaultY };
  };

  // استخدام الدالة المناسبة بناءً على isReady
  const { x: finalBottleX, y: finalBottleY } = isReady ? getReadyBottlePosition() : getFreeBottlePosition();

  // تسجيل للتحقق من القيم
  useEffect(() => {
    console.log('ChemicalBottle Props:', { isReady, bottleX, bottleY });
    console.log('Calculated Position:', { finalBottleX, finalBottleY });
  }, [isReady, bottleX, bottleY, finalBottleX, finalBottleY]);

  // تأثير للتحكم في وقت الصب
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPouring) {
      timer = setTimeout(() => {
        onPourComplete();
      }, 2000); // 2 ثانية لتحريك الصب
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPouring, onPourComplete]);

  // تأثير لإظهار تقدم الصب
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPouring) {
      interval = setInterval(() => {
        setPourProgress((prev) => {
          if (prev < 100) return prev + 5;
          if (interval) clearInterval(interval);
          return 100;
        });
      }, 100);
    } else {
      setPourProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPouring]);

  // تشغيل وإيقاف صوت السكب بناءً على حالة السكب
  useEffect(() => {
    if (isPouring && pouringAudioRef.current) {
      pouringAudioRef.current.volume = 0.5; // ضبط مستوى الصوت
      pouringAudioRef.current.currentTime = 0; // إعادة الصوت إلى البداية
      pouringAudioRef.current.play().catch(e => console.log('Could not play pouring sound:', e));
      console.log('Playing pouring sound');
    } else if (!isPouring && pouringAudioRef.current) {
      pouringAudioRef.current.pause(); // إيقاف الصوت
      pouringAudioRef.current.currentTime = 0; // إعادة الصوت إلى البداية
      console.log('Stopped pouring sound');
    }
  }, [isPouring, pouringAudioRef]);

  if (!isPouring) return null;

  return (
    <motion.div
      className="absolute z-20"
      initial={{ x: finalBottleX, y: finalBottleY, rotate: 0 }}
      animate={{ x: finalBottleX, y: finalBottleY + 150, rotate: isPouring ? 60 : 0 }} // تحريك الزجاجة للأسفل أثناء الصب
      transition={{ duration: 1 }}
      style={{
        transformOrigin: 'bottom right',
        width: '80px',
        height: '180px',
      }}
    >
      {/* هيكل الزجاجة */}
      <div className="relative">
        {/* عنق الزجاجة */}
        <div className="h-14 w-6 mx-auto bg-gray-200/80 rounded-t-sm relative senter"></div>

        {/* جسم الزجاجة */}
        <div className="h-28 w-20 mx-auto bg-gray-200/80 rounded-md relative overflow-hidden">
          {/* لون المادة الكيميائية */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-500"
            style={{
              backgroundColor: chemical.color,
              height: `${100 - pourProgress}%`,
              transition: 'height 0.5s ease-in-out',
            }}
          ></div>

          {/* ملصق المادة الكيميائية */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/70 px-2 py-1 rounded text-xs shadow-sm">{chemical.name}</div>
          </div>
        </div>
      </div>

      {/* تأثير سكب السائل */}
      {isPouring && pourProgress < 100 && (
        <div className="absolute top-16 left-[2.25rem] w-1.5">
          <motion.div
            className="liquid-stream"
            style={{
              backgroundColor: chemical.color,
              width: '6px', // عرض التدفق
              height: isReady ? '60px' : '80px', // طول التدفق يعتمد على نوع التفاعل
              borderRadius: '2px',
              transformOrigin: 'top',
              position: 'absolute',
              top: '100%',
              left: '0',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* قطرات */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2"
              style={{ backgroundColor: chemical.color }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 20, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            ></motion.div>
          </motion.div>
        </div>
      )}

      {/* عنصر الصوت للسكب */}
      <audio ref={pouringAudioRef} src="/sounds/pouring.mp3" />
    </motion.div>
  );
};

export default ChemicalBottle;