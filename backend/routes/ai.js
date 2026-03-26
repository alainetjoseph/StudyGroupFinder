const express = require("express")
const router = express.Router()
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post("/ask", async (req, res) => {

    try {

        const question = req.body?.question

        if (!question) {
            return res.status(400).json({
                message: "Question required"
            })
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        })

        // Get real current date
        const today = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })

        const prompt = `
You are an AI study assistant.

Important information:
Today's date is ${today}.

User question: ${question}

Answer clearly.
`

        const result = await model.generateContent(prompt)

        const answer = result.response.text()

        res.json({ answer })

    } catch (error) {

        console.log("AI ERROR:", error)

        res.status(500).json({
            message: "AI request failed"
        })

    }

})

module.exports = router