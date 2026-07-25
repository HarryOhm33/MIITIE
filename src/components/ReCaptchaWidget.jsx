import { useEffect, useRef } from "react";

const ReCaptchaWidget = ({ onVerify, onExpire }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const siteKey =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
    "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Official Google test site key

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (
        window.grecaptcha &&
        window.grecaptcha.render &&
        containerRef.current &&
        widgetIdRef.current === null &&
        isMounted
      ) {
        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            "expired-callback": () => {
              if (onExpire) onExpire();
            },
          });
        } catch (e) {
          // Ignore re-render errors if already rendered
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderWidget();
    } else {
      const existingScript = document.getElementById("recaptcha-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "recaptcha-script";
        script.src =
          "https://www.google.com/recaptcha/api.js?onload=onRecaptchaApiLoaded&render=explicit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        window.onRecaptchaApiLoaded = () => {
          renderWidget();
        };
      } else {
        const interval = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.render) {
            clearInterval(interval);
            renderWidget();
          }
        }, 300);
        return () => clearInterval(interval);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [siteKey, onVerify, onExpire]);

  return (
    <div className="relative z-10 flex justify-center items-center p-2 sm:p-4 bg-orange-50/50 border border-orange-100/80 rounded-2xl shadow-sm my-4 overflow-hidden w-full max-w-md mx-auto pointer-events-auto cursor-pointer">
      <div
        ref={containerRef}
        className="transform origin-center scale-[0.85] xs:scale-[0.9] sm:scale-100 transition-transform pointer-events-auto cursor-pointer"
      />
    </div>
  );
};

export default ReCaptchaWidget;
