import { motion } from "framer-motion";

import {
  FaRobot,
  FaCheckCircle,
  FaBrain,
} from "react-icons/fa";

export default function AIRecommendation({

  analysis,

}) {

  if (!analysis) return null;

  return (

    <motion.div

      initial={{

        opacity: 0,

        y: 20,

      }}

      animate={{

        opacity: 1,

        y: 0,

      }}

      transition={{

        duration: 0.5,

      }}

      style={{

        background:

          "linear-gradient(135deg,#1e3a8a,#0f172a)",

        padding: "30px",

        borderRadius: "18px",

        marginBottom: "30px",

        border: "1px solid #334155",

        boxShadow:

          "0 15px 35px rgba(0,0,0,.35)",

      }}

    >

      <div

        style={{

          display: "flex",

          alignItems: "center",

          gap: "12px",

          marginBottom: "20px",

        }}

      >

        <FaRobot

          size={34}

          color="#38bdf8"

        />

        <h2

          style={{

            margin: 0,

          }}

        >

          AI Recommendation

        </h2>

      </div>

      <h1

        style={{

          marginBottom: "10px",

          color: "#22c55e",

        }}

      >

        {analysis.recommended_strategy}

      </h1>

      <div

        style={{

          display: "flex",

          alignItems: "center",

          gap: "10px",

          marginBottom: "25px",

        }}

      >

        <FaBrain color="#38bdf8" />

        Confidence

        <strong>

          {analysis.confidence}%

        </strong>

      </div>

      {

        analysis.reasons.map(

          (reason, index) => (

            <div

              key={index}

              style={{

                display: "flex",

                gap: "12px",

                marginBottom: "12px",

                alignItems: "center"

              }}

            >

              <FaCheckCircle

                color="#22c55e"

              />

              {reason}

            </div>

          )

        )

      }

    </motion.div>

  );

}