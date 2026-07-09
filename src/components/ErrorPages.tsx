import { 
  WifiOff, 
  Lock, 
  Compass, 
  ServerCrash, 
  HelpCircle, 
  RefreshCw, 
  ArrowLeft,
  Home,
  Database
} from "lucide-react";
import { motion } from "motion/react";

interface ErrorPagesProps {
  errorType: "no_internet" | "auth_failure" | "not_found" | "server_error" | "firestore_error" | "unknown";
  onRetry?: () => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
}

export default function ErrorPages({ 
  errorType, 
  onRetry, 
  onNavigateHome, 
  onNavigateLogin 
}: ErrorPagesProps) {
  
  const errorDetails = {
    no_internet: {
      title: "Connection Offline",
      description: "Artora is unable to establish contact with the decentralized studio node. Please check your physical network connection or cellular alignment.",
      icon: WifiOff,
      badge: "LEDGER_NET_DISCONNECTED",
      actionText: "Verify Connection",
      action: onRetry || (() => window.location.reload()),
      secondaryText: "Return to Home",
      secondaryAction: onNavigateHome
    },
    auth_failure: {
      title: "Authentication Failed",
      description: "Your secure login credentials do not align with our ledger registry hashes. This could occur if your token has expired or credentials were typed incorrectly.",
      icon: Lock,
      badge: "AUTH_REGISTRY_REJECTED",
      actionText: "Try Logging In",
      action: onNavigateLogin || onNavigateHome,
      secondaryText: "Return to Home",
      secondaryAction: onNavigateHome
    },
    not_found: {
      title: "Coordinates Missing",
      description: "The bespoke screen or physical craft coordinate you seek is currently unavailable. It may have been archived, sold out, or moved to a private vault.",
      icon: Compass,
      badge: "STUDIO_ROUTE_404",
      actionText: "Back to Marketplace",
      action: onNavigateHome,
      secondaryText: null,
      secondaryAction: null
    },
    server_error: {
      title: "Secure Node Timeout",
      description: "Our server node suffered a temporary transaction overflow during secure escrow settlement. Rest assured, your funds and assets remain perfectly protected.",
      icon: ServerCrash,
      badge: "ESCROW_NODE_500",
      actionText: "Reload Workspace",
      action: onRetry || (() => window.location.reload()),
      secondaryText: "Return to Home",
      secondaryAction: onNavigateHome
    },
    firestore_error: {
      title: "Ledger Index Error",
      description: "Our secure cloud ledger databases were unable to authenticate or index this craft listing. Please rest assured your assets and account remain safe.",
      icon: Database,
      badge: "FIRESTORE_LEDGER_ERR",
      actionText: "Retry Connection",
      action: onRetry || (() => window.location.reload()),
      secondaryText: "Return to Home",
      secondaryAction: onNavigateHome
    },
    unknown: {
      title: "Anomalous Intrusion",
      description: "Our digital guild canvas suffered an unexpected rendering anomaly. We have logged the trace internally and our master artisans are on top of it.",
      icon: HelpCircle,
      badge: "CANVAS_ERR_UNKNOWN",
      actionText: "Reload Application",
      action: () => window.location.reload(),
      secondaryText: "Return to Home",
      secondaryAction: onNavigateHome
    }
  };

  const currentError = errorDetails[errorType] || errorDetails.unknown;
  const IconComponent = currentError.icon;

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-6 text-center select-none font-sans relative overflow-hidden">
      {/* Background elegant circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] aspect-square rounded-full bg-radial from-[#C9A227]/4 to-transparent blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-xl space-y-6 z-10"
      >
        {/* Error icon circle */}
        <div className="relative w-16 h-16 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-center mx-auto text-gray-800 shadow-xs">
          <IconComponent className="w-6 h-6 text-[#C9A227]" />
          
          {/* Subtle error dot indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </div>

        {/* Text information */}
        <div className="space-y-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-red-500 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-100/60 inline-block">
            {currentError.badge}
          </span>
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900 tracking-tight leading-tight">
            {currentError.title}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
            {currentError.description}
          </p>
        </div>

        {/* Action controls */}
        <div className="space-y-3 pt-2">
          {/* Main Action */}
          <button
            onClick={currentError.action}
            className="w-full py-3.5 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-gray-900 text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C9A227] hover:text-gray-900 group-hover:rotate-180 transition-transform duration-500" />
            <span>{currentError.actionText}</span>
          </button>

          {/* Secondary Action */}
          {currentError.secondaryText && currentError.secondaryAction && (
            <button
              onClick={currentError.secondaryAction}
              className="w-full py-3.5 border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 bg-white"
            >
              <Home className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentError.secondaryText}</span>
            </button>
          )}
        </div>

        {/* Technical help indicator */}
        <div className="pt-4 border-t border-gray-100 flex flex-col items-center justify-center space-y-1 text-[10px] text-gray-400 font-mono">
          <span>Artora Client Guild • v0.6.0-beta</span>
          <span>Support: <a href="mailto:joinartora@gmail.com" className="underline hover:text-[#C9A227]">joinartora@gmail.com</a></span>
        </div>
      </motion.div>
    </div>
  );
}
