import { useState } from "preact/hooks";
import ToggleDarkMode from "./ToggleDarkMode.tsx";
import { Processing } from "../components/Processing.tsx";

const promptExamples = [
    // Recon
    "What tools do you recommend for Reconnaissance?",
    "How to use nmap? Give me command examples!",
    "How to use rustscan? Give me command examples!",

    // Protocols
    "What protocol uses port 22?",
    "What protocol uses port 80?",

    // Pentest
    "How to pentest on Flask web apps?",

    // Enumeration
    "How to enumerate SMB?",

    // Payloads
    "Generate 3 XSS examples contain `<iframe>`.",

    // Port forwarding
    "How to port forwarding on Linux?",
]


export default function Room() {
    const [darkMode, setDarkMode] = useState(true);

    const [prompt, setPrompt] = useState("");
    const [processing, setProcessing] = useState(false);
    const [answer, setAnswer] = useState("");

    const [modalReset, setModalReset] = useState(false);
    const [modalAbout, setModalAbout] = useState(false);

    const handleInput = (e?: Event, txt?: string) => {
        if (e !== undefined) {
            const target = e.target as HTMLInputElement;
            setPrompt(target.value);
        } else if (txt !== undefined) {
            setPrompt(txt);
        }

        // Expand the textarea
        const defaultTextAreaElem = 24;
        const formElem = document.forms[0];
        const textAreaElem = document.getElementById('prompt-textarea');
        if (formElem && textAreaElem) {
            textAreaElem.style.height = `${defaultTextAreaElem}px`;
            textAreaElem.style.height = defaultTextAreaElem + textAreaElem.scrollHeight + "px";
            textAreaElem.style.height = defaultTextAreaElem/2 + textAreaElem.scrollHeight + "px";

            const lineHeight = parseInt(window.getComputedStyle(textAreaElem).lineHeight, 10);
            const lines = textAreaElem.scrollHeight / lineHeight;

            if (lines < 3) {
                textAreaElem.style.height = `${defaultTextAreaElem}px`;
            }
        }

    }

    const handleKeyDown = async (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            setProcessing(true);

            const finalPrompt = prompt;

            // Initialize outputs
            setAnswer("");
            setPrompt("");

            const textAreaElem = document.getElementById('prompt-textarea');
            const outputWrapperElem = document.getElementById('output-wrapper');
            const outputElem = document.getElementById('output');

            if (textAreaElem) {
                textAreaElem.style.height = "24px";
            }

            if (!outputWrapperElem || !outputElem) {
                setProcessing(false);
                return;
            }

            // Create the message element
            const div = document.createElement('div');
            div.classList.add("message-me");

            const balloon = document.createElement('div');
            balloon.classList.add("message-me_balloon");
            const p = document.createElement('p');
            p.innerText = prompt;
            balloon.appendChild(p);
            div.appendChild(balloon);

            outputElem.appendChild(div);

            try {
                const result = await fetch(`/api/generate/?prompt=${encodeURIComponent(finalPrompt)}`);
                const outputText = await result.text();

                // Create the reply element.
                const div = document.createElement('div');
                div.classList.add("message-reply");

                const img = document.createElement('img');
                img.src = "/vulniper.png";
                img.alt = "Vulniper";
                img.classList.add("message-reply_icon");
                div.appendChild(img);

                const balloon = document.createElement('div');
                balloon.classList.add("message-reply_balloon");
                const p = document.createElement('p');
                p.innerText = outputText.replace("\n", "");
                balloon.appendChild(p);
                div.appendChild(balloon);

                outputElem.appendChild(div);

                 // After generating, scroll down in the output wrapper element
                outputWrapperElem.scrollTo({
                    top: outputWrapperElem.scrollHeight,
                    behavior: 'smooth',
                });
            } catch (err) {
                alert(err);
                setProcessing(false);
                return;
            }

            setProcessing(false);
        }
    }

    const handleClickExample = () => {
        const example = promptExamples[Math.floor(Math.random() * promptExamples.length)];
        setPrompt(example);
    }

    const handleClickTool = (e: Event) => {
        const target = e.target as HTMLButtonElement;
        if (!target) {
            return;
        }

        const toolType = target.dataset.tool;
        if (toolType === "reset") {
            setModalReset(true);
        } else if (toolType == "about") {
            setModalAbout(true);
        }
    }

    const handleReset = () => {
        const outputElem = document.getElementById('output');
        if (!outputElem) {
            return;
        }

        while (outputElem.firstChild) {
            outputElem.removeChild(outputElem.firstChild);
        }

        setModalReset(false);
    }

    const handleClickModalBg = () => {
        setModalReset(false);
        setModalAbout(false);
    }

    return (
        <>
            <div class="w-full h-screen overflow-hidden">

                {/* Main area */}
                <div class="w-full h-full grid" style="grid-template-rows: 1fr 200px">

                    {/* Output area */}
                    <div
                        id="output-wrapper"
                        class="
                            mx-auto my-6 w-full h-[80vh] overflow-x-hidden overflow-y-auto
                            flex flex-col items-center gap-y-8">
                        <div id="output" class="w-[95%] md:w-[70%] lg:w-[50%]"></div>
                    </div>

                    {/* Prompt area */}
                    <form
                        autoComplete="off"
                        class="
                            fixed bottom-20 left-1/2 z-50 translate-x-[-50%] w-[90%] md:w-[60%] lg:w-[600px] bg-coolGray-500
                            rounded-2xl p-4">
                        <textarea
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            value={prompt}
                            placeholder="Any questions for cybersecurity? Prompt here!"
                            rows={1}
                            readOnly={processing ? true : false}
                            id="prompt-textarea"
                            class="
                                resize-none overflow-x-hidden overflow-y-auto
                                w-full max-h-[200px] bg-transparent focus:outline-none text-lg
                            "></textarea>

                        <div class="absolute top-[-40px] left-0 lg:top-0 lg:left-[-40px]">
                            <Processing active={processing} darkMode={darkMode} />
                        </div>
                    </form>


                    <div class="fixed bottom-10 left-1/2 z-50 translate-x-[-50%]">
                        <span
                            onClick={handleClickExample}
                            class="text-base text-black dark:text-white font-bold hover:underline cursor-pointer">
                            Click to prompt example!
                        </span>
                    </div>
                </div>
            </div>

            <div class="fixed top-4 right-2 md:top-5 md:right-5 lg:top-10 lg:right-20 flex flex-col gap-y-6">

                {/* Tools */}
                <div class="flex items-center justify-end gap-x-4">
                    {/* Reset button */}
                    <button data-tool="reset" onClick={handleClickTool} class="hover:cursor-pointer focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke={`${darkMode ? 'white' : 'black'}`} class="w-6 h-6 pointer-events-none">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>

                    {/* About */}
                    <button data-tool="about" onClick={handleClickTool} class="hover:cursor-pointer focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke={`${darkMode ? 'white' : 'black'}`} class="w-6 h-6 pointer-events-none">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </button>

                    {/* Toggle dark mode */}
                    <ToggleDarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>

                {/* Links */}
                <div class="flex items-center justify-end gap-x-4">
                    {/* Exploit Notes */}
                    <a href="https://exploit-notes.hdks.org/" target="_blank" rel="noopener noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke={`${darkMode ? 'white' : 'black'}`} class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                        </svg>
                    </a>

                     {/* Twitter */}
                     <a href="https://twitter.com/hideckies" target="_blank" rel="noopener noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill={`${darkMode ? 'white' : 'black'}`} class="w-6 h-6">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a href="https://github.com/hideckies/vulniper" target="_blank" rel="noopener noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill={`${darkMode ? 'white' : 'black'}`} class="w-6 h-6">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                </div>

            </div>

            {/* Modals - Reset */}
            <div
                id="modal-reset"
                class={`
                    fixed top-1/2 left-1/2 z-[100] translate-x-[-50%] translate-y-[-50%]
                    w-[90%] md:w-[50%] lg:w-[30%]
                    bg-gray-800 border-2 border-black p-4
                    ${modalReset ? null : 'hidden'}
                `}>
                <div class="w-full flex flex-col gap-y-6">
                    <h2 class="text-lg font-bold">Reset Results</h2>
                    <p>Would you like to remove all results?</p>
                    <div class="my-4 w-full flex items-center justify-around gap-x-4">
                        <button
                            onClick={handleReset}
                            class="w-[120px] bg-blueGray-500 hover:bg-gray-400 py-2">
                            OK
                        </button>
                        <button
                            onClick={() => setModalReset(false)}
                            class="w-[120px] bg-blueGray-500 hover:bg-gray-400 py-2">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal About */}
            <div
                id="modal-about"
                class={`
                    fixed top-1/2 left-1/2 z-[100] translate-x-[-50%] translate-y-[-50%]
                    w-[90%] md:w-[60%] lg:w-[40%]
                    bg-gray-800 border-2 border-black rounded-lg p-8
                    ${modalAbout ? null : 'hidden'}
                `}>
                <div class="w-full flex flex-col gap-y-6">
                    <h2 class="text-lg text-current font-bold">What is the Vulniper?</h2>
                    <div class="w-full flex flex-col gap-y-4">
                        <p>
                            Vulniper helps our cybersecurity works such as penetration testing, threat hunting ans so on.
                            It uses the open source Falcon LLM model in Hugging Face Hub.
                        </p>
                        <div class="mt-6 w-full flex flex-col items-center gap-y-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="yellow" class="w-9 h-9">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <p>
                                This app is intended for ethical hacking.
                                It is prohibited to try the techniques generated by this app on servers not under your control.
                                This app is not responsible for those actions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Background */}
            <div
                id="modal-bg"
                class={`
                    fixed top-0 left-0 z-[90] w-screen h-screen bg-black opacity-50
                    ${modalReset || modalAbout ? null : 'hidden'}`}
                onClick={handleClickModalBg}></div>
        </>
    );
}
