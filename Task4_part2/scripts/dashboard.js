function toggleClassName(itemCalled) {
    const item = document.querySelector(`.${itemCalled}`);
    if (item.style.display == "flex") {
        item.style.display = "none";
    }
    else {
        item.style.display = "flex"
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("index.json").then((response) =>
        response
            .json()
            .then((data) => {
                data.cards.map((d) => {
                    populateCards(d);
                });
            })
            .catch((error) => console.error("Error fetching JSON data:", error))
    );
});

function populateCards(cards) {
 
    const cardsClass = document.querySelector('.content-3');
 
    individualCard => {
 
        const card = document.createElement("div");
        card.className = "card";
 
        // details
 
        const details = document.createElement('div');
        details.className = "description";
 
        const img = document.createElement('img');
        img.setAttribute('src', individualCard.image);
 
        // content
 
        const content = document.createElement('div');
        content.className = 'info';
 
        const title = document.createElement('div');
        title.className = "topic quicksand-medium-16px-222222";
        title.setAttribute('style', "font-size: 20px; font-weight: bold;margin-top: 0px;");
        title.innerHTML = individualCard.title;
 
        const desc = document.createElement('div');
        desc.className = "subject"
        desc.innerHTML = `${individualCard.subject} &nbsp; | &nbsp;Grade ${individualCard.grade} <span style="color: green;font-weight: bold;">${individualCard.addition}</span>`;
 
        const divisions = document.createElement('div');
        divisions.innerHTML = `<b>${individualCard.units}</b> Units &nbsp;<b>${individualCard.lessons}</b> Lessons &nbsp;<b>${individualCard.topics}</b> Topics`;
 
 
        const select = document.createElement('select');
        individualCard.classesOptions.length > 0 ?
            "" :
            select.setAttribute('disabled', true);
        ;
        select.setAttribute('name', 'classType');
        select.setAttribute('id', 'classType');
 
 
        select.innerHTML = `${individualCard.classesOptions.map((classes) => {
            return `<option value="${classes}">${classes}</option>`
        })}`
 
        individualCard.classesOptions.length > 0 ?
            "" :
            select.innerHTML = `<option value="noClasses">No Classes</option>`;
        ;
 
 
        const extraInfo = document.createElement('p');
        extraInfo.innerHTML = `${individualCard.info.totalStudents} Students &nbsp; | &nbsp;${individualCard.info.duration}`;
 
 
        content.appendChild(title);
        individualCard.subject ? content.appendChild(desc) : "";
        (individualCard.units > 0 || individualCard.topics || individualCard.lessons) ? content.appendChild(divisions) : "";
        content.appendChild(select);
 
        (individualCard.info.totalStudents || individualCard.info.duration) ?
            content.appendChild(extraInfo) : "";
 
        // favorite
 
        const starIcon = document.createElement('img');
        starIcon.className = 'favIcon';
        starIcon.setAttribute('src', 'icons/favourite.svg');
 
        (individualCard.favorite) ?
            starIcon.setAttribute('style', "height: 35px;") :
            starIcon.setAttribute('style', "height: 35px;opacity: 0.2;")
 
        details.appendChild(img)
        details.appendChild(content)
        details.append(starIcon)
 
        // operations
 
        const operations = document.createElement('div');
        operations.className = 'operations';
        operations.innerHTML = `<img src="icons/preview.svg" style="font-size: 22px;"></img>
                    <img src="icons/manage course.svg" style="font-size: 22px;"></img>
                    <img src="icons/grade submissions.svg" style="font-size: 22px;"></img>
                    <img src="icons/reports.svg" style="font-size: 22px;"></img>`
 
        const expired = document.createElement('span');
        expired.className = "expired";
        expired.innerHTML = "Expired";
 
        card.appendChild(details)
        card.appendChild(operations)
 
        // expired
 
        individualCard.expired ? card.appendChild(expired) : ""
 
        console.log(card)
        cardsClass.appendChild(card);
 
 
    }
 
}
