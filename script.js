const container =
    document.getElementById("lessonContainer");

let lessons = [];

fetch("lessons.json")
    .then(res => res.json())
    .then(data => {

        lessons = data;

        renderLessons(data);

        updateProgress();

    });

function renderLessons(data) {

    container.innerHTML = "";

    data.forEach(item => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h2>${item.id}. ${item.title}</h2>
            <p>${item.summary}</p>

            <button
            class="detail-btn"
            onclick="showDetail(${item.id})">
            Xem chi tiết
            </button>

            <button
            class="summary-btn"
            onclick="showSummary(${item.id})">
            Xem tóm tắt
            </button>
        `;

        container.appendChild(card);
    });

}

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");


async function showDetail(id) {

    const lesson =
        lessons.find(x => x.id === id);

    if (!lesson) return;

    modalTitle.innerText =
        lesson.title;

    try {

        const response =
            await fetch(lesson.file);

        const content =
            await response.text();

        modalBody.innerHTML =
            marked.parse(content);

    } catch (error) {

        modalBody.innerHTML =
            "<p>Không thể tải nội dung bài học.</p>";

    }

    modal.style.display = "block";

    markCompleted(id);

}


function showSummary(id) {

    const lesson =
        lessons.find(x => x.id === id);

    if (!lesson) return;

    modalTitle.innerText =
        lesson.title;

    modalBody.innerHTML =
        `<p>${lesson.summary}</p>`;

    modal.style.display = "block";

}


document
    .getElementById("closeModal")
    .onclick = () => {

        modal.style.display = "none";

    };

window.onclick = (event) => {

    if (event.target === modal) {

        modal.style.display = "none";

    }

};

document
    .getElementById("searchInput")
    .addEventListener("input", e => {

        const keyword =
            e.target.value.toLowerCase();

        const filtered =
            lessons.filter(item =>

                item.title
                    .toLowerCase()
                    .includes(keyword)

                ||

                item.summary
                    .toLowerCase()
                    .includes(keyword)

            );

        renderLessons(filtered);

    });



let completed =
    JSON.parse(
        localStorage.getItem("completed")
    ) || [];


function markCompleted(id) {

    if (!completed.includes(id)) {

        completed.push(id);

        localStorage.setItem(
            "completed",
            JSON.stringify(completed)
        );

        updateProgress();

    }

}


function updateProgress() {

    if (lessons.length === 0) return;

    const percent =
        (completed.length /
            lessons.length) * 100;

    document.getElementById(
        "progressBar"
    ).style.width =
        percent + "%";

    document.getElementById(
        "progressText"
    ).innerText =
        `Đã học: ${Math.round(percent)}%`;

}

const quizContainer =
    document.getElementById("quizContainer");

if (quizContainer) {

    quizData.forEach((q, index) => {

        const div =
            document.createElement("div");

        div.className = "question";

        div.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3>

            ${q.options.map((opt, i) => `
                <label>
                    <input
                        type="radio"
                        name="q${index}"
                        value="${i}">
                    ${opt}
                </label>
                <br>
            `).join("")}
        `;

        quizContainer.appendChild(div);

    });

    document
        .getElementById("submitQuiz")
        .onclick = () => {

            let score = 0;

            quizData.forEach((q, index) => {

                const selected =
                    document.querySelector(
                        `input[name="q${index}"]:checked`
                    );

                const questionDiv =
                    document.querySelectorAll(
                        ".question"
                    )[index];

                let resultBox =
                    questionDiv.querySelector(
                        ".result"
                    );

                if (!resultBox) {

                    resultBox =
                        document.createElement("div");

                    resultBox.className =
                        "result";

                    questionDiv.appendChild(
                        resultBox
                    );
                }

                if (!selected) {

                    resultBox.innerHTML =
                        `
                    <span class="wrong">
                        ❌ Chưa chọn đáp án
                    </span>
                    `;

                    return;
                }

                const userAnswer =
                    Number(selected.value);
                document
                    .querySelectorAll(
                        `input[name="q${index}"]`
                    )
                    .forEach(input => {

                        input.disabled = true;

                    });

                if (userAnswer === q.answer) {

                    score++;

                    resultBox.innerHTML =
                        `
                    <span class="correct">
                        ✅ Chính xác
                    </span>
                    `;

                } else {

                    resultBox.innerHTML =
                        `
                    <span class="wrong">
                        ❌ Sai
                    </span>

                    <br>

                    <span class="answer">
                        Đáp án đúng:
                        ${q.options[q.answer]}
                    </span>
                    `;
                }

            });

            document
                .getElementById("quizResult")
                .innerHTML = `
                <h2>
                    🎯 Kết quả:
                    ${score}/${quizData.length}
                </h2>
            `;

            localStorage.setItem(
                "lastScore",
                score
            );

        };

    document
        .getElementById("resetQuiz")
        .onclick = () => {

            document
                .querySelectorAll('input[type="radio"]')
                .forEach(input => {

                    input.checked = false;
                    input.disabled = false;

                });

            document
                .querySelectorAll(".result")
                .forEach(result => {

                    result.remove();

                });

            document.getElementById(
                "quizResult"
            ).innerHTML = "";

        };
}

const darkModeBtn =
    document.getElementById("darkModeBtn");

// load trạng thái đã lưu
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkModeBtn.innerText = "☀️ Light Mode";
}

darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    if (isDark) {

        localStorage.setItem("theme", "dark");
        darkModeBtn.innerText = "☀️ Light Mode";

    } else {

        localStorage.setItem("theme", "light");
        darkModeBtn.innerText = "🌙 Dark Mode";

    }

});