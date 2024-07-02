function togglestyle(itemCalled) {
    const item = document.querySelector(`.${itemCalled}`);
    if (item.style.display == "flex") {
        item.style.display = "none";
    }
    else {
        item.style.display = "flex"
    }
}


function toggleClassName(itemCalled, classToToggle) {
    const item = document.querySelector(`.${itemCalled}`);
    item.classList.toggle(classToToggle);
}


document.addEventListener("DOMContentLoaded", function () {
    fetch("index.json")
        .then((response) => response.json())
        .then((data) => {
            data.cards.forEach((cardData) => {
                populateCards(cardData);
            });
        })
        .catch((error) => console.error("Error fetching JSON data:", error));
});

function populateCards(cardData) {
    const cardsContainer = document.querySelector('.content-3');

    const empty = document.createElement("div");
    empty.className = cardData.expired ? "expired" : "empty";

    const card = document.createElement("div");
    card.className = "card";

    const description = document.createElement('div');
    description.className = "descripton";

    const imgDiv = document.createElement('div');
    imgDiv.className = "img-div";
    const img = document.createElement('img');
    img.setAttribute('src', cardData.image);
    img.setAttribute('alt', '');
    imgDiv.appendChild(img);

    const info = document.createElement('div');
    info.className = 'info';

    const cardHead = document.createElement('div');
    cardHead.className = "card-head";
    const title = document.createElement('div');
    title.className = "topic quicksand-medium-16px-222222";
    title.innerHTML = cardData.title;

    const star = document.createElement('div');
    star.className = "star";
    const starIcon = document.createElement('img');
    starIcon.setAttribute('src', 'imgs/favourite.svg');
    if (!cardData.favorite) {
        starIcon.style.opacity = "0.2";
    }
    star.appendChild(starIcon);

    cardHead.appendChild(title);
    cardHead.appendChild(star);

    const subject = document.createElement('div');
    subject.className = "subject";
    subject.innerHTML = `<span>${cardData.subject} | Grade ${cardData.grade}</span> <span class="extra-class"> + ${cardData.addition}</span>`;

    const details = document.createElement('div');
    details.className = "subject";
    // Check for zero values and set display to none
    const unitsDisplay = cardData.units === 0 ? "none" : "inline-block";
    const lessonsDisplay = cardData.lessons === 0 ? "none" : "inline-block";
    const topicsDisplay = cardData.topics === 0 ? "none" : "inline-block";
    details.innerHTML = `
        <span class="number" style="display: ${unitsDisplay};">${cardData.units} </span><span class="class-detail" style="display: ${unitsDisplay};"> Units</span>
        <span class="number" style="display: ${lessonsDisplay};">${cardData.lessons} </span><span class="class-detail" style="display: ${lessonsDisplay};"> Lessons</span>
        <span class="number" style="display: ${topicsDisplay};">${cardData.topics} </span><span class="class-detail" style="display: ${topicsDisplay};"> Topics</span>
    `;

    const contentInterior = document.createElement('div');
    contentInterior.className = "content-3-interior";
    const selectDiv = document.createElement('div');
    selectDiv.className = "select2 select-div";
    const select = document.createElement('select');
    select.name = "Sort";
    select.id = "Sort";
    select.className = "custom-select1 quicksand-medium-16px-222222 classroom";
    if (cardData.classesOptions.length > 0) {
        cardData.classesOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    } else {
        select.disabled = true;
        const opt = document.createElement('option');
        opt.value = "noClasses";
        opt.textContent = "No Classes";
        select.appendChild(opt);
    }
    selectDiv.appendChild(select);
    contentInterior.appendChild(selectDiv);

    const classInfo = document.createElement('div');
    classInfo.className = "class-info";
    const studentDisplay = cardData.info.totalStudents === 0 ? "none" : "inline-block";
    const durationDisplay = cardData.info.duration ? "inline-block" : "none";
    classInfo.innerHTML = `
        <span style="display: ${studentDisplay};">${cardData.info.totalStudents} Students</span> 
        <span style="display: ${durationDisplay};">${cardData.info.duration}</span>
        `;
    info.appendChild(cardHead);
    info.appendChild(subject);
    info.appendChild(details);
    info.appendChild(contentInterior);
    info.appendChild(classInfo);

    description.appendChild(imgDiv);
    description.appendChild(info);

    const cardBottom = document.createElement('div');
    cardBottom.className = "card-buttom";
    cardBottom.innerHTML = `
        <img src="imgs/preview.svg" alt="" class="icon">
        <img src="imgs/manage course.svg" alt="" class="icon">
        <img src="imgs/grade submissions.svg" alt="" class="icon">
        <img src="imgs/reports.svg" alt="" class="icon">
    `;

    card.appendChild(description);
    card.appendChild(cardBottom);

    if (cardData.expired) {
        const expired = document.createElement('span');
        expired.className = "expired";
        expired.innerHTML = "EXPIRED";
        empty.appendChild(expired);
    }
    empty.appendChild(card);
    cardsContainer.appendChild(empty);

}


function updateAlerts(alerts) {

    console.log(alerts)

    alerts.map((alert)=>{

        const alertContainer = document.querySelector('.alerts');

        const alertBox = document.createElement('div');
        alertBox.className = 'individualAlert';
        (alert.ticked ? alertBox.classList.add('ticked') : "")
    
        alertBox.innerHTML =
            `<p class="title">${alert.title}</p>
            ${alert.course ? `<p class="information">${alert.course}</p>` : ""}
            <div class="more">
                <p class="time" style="width: 100%;text-align: right;">${alert.time}</p>
            </div>`
    
        console.log(alertBox)
        alertContainer.appendChild(alertBox);
    })

}

function updateAnnouncements(announces) {
    console.log(announces)

    announces.map((announce)=>{

        const announceContainer = document.querySelector('.announce');

        const announceBox = document.createElement('div');
        announceBox.className = 'individualAnnouncements';
        (announce.ticked ? announceBox.classList.add('ticked') : "")
    
        announceBox.innerHTML =
            `<p class="author">PA:<b>${announce.author}</b></p>
            <p class="title">${announce.title}</p>
            <div class="more">
                <p class="file">
                ${announce.files > 0 ? `<span><i style="transform: rotate(-45deg);color: #6E6E6E;" class="fa-solid fa-paperclip"></i></span>` : ""}
                
                ${announce.files > 0 ? announce.files +" files are attached" : ""}</p>
                <p class="time">${announce.time}</p>
            </div>`
    
        console.log(announceBox)
        announceContainer.appendChild(announceBox);
    })
}