let catIdArr = [];
let catTitle = [];
let dogIdArr = [];

async function getCategoryIds() {
	const res = await axios.get("https://jservice.io/api/categories", {params: {count: 80 }});
    console.log(res);
    const myId= res.data.map((val)=> {if(val.clues_count>=5)
    if(val.id!=null)
    return val.id})
    console.log(myId);
    for (let i = 0; i < 6; i++) {
		dogIdArr.push(myId[Math.floor(Math.random() * myId.length + 1)]);
	}
    console.log(dogIdArr);
}
let catQuestions = [];
async function getCategoryInfo(id) {
	const res = await axios.get(`https://jservice.io/api/category?id=${id}`);
    console.log(res);
	let clueArr = [];
    console.log(clueArr);
	for (let i = 0; i < 5; i++) {
		let obj = {
			question : res.data.clues[i].question,
			answer   : res.data.clues[i].answer,
			showing  : null
		};
		clueArr.push(obj);
	}
	catTitle.push(res.data.title);
	catQuestions.push({ clueArr });
	return { title: res.data.title, clueArr };
}

async function getCategory() {

	return dogIdArr.forEach((id) => getCategoryInfo(id));

}

async function fillTable() {
	$('#jeopardy thead').empty();
	let $tr = $('<tr>');
	for (let i = 0; i < 6; i++) {
		$tr.append($('<th>').text(catTitle[i]));
	}
	$('#jeopardy thead').append($tr);
	$('#jeopardy tbody').empty();
	for (let j = 0; j < 5; j++) {
		let tr = $('<tr>');
		for (let k = 0; k < 6; k++) {
			tr.append($('<td>').attr('id', `${k}-${j}`).text('?'));
                // for (let a=500;a>0; a=a-100){
                // td.attr('id', `${k}-${j}`).text(`?${a}`);
                // }
		}
		$('#jeopardy thead').append(tr);
	}
}
function handleClick(evt) {
	let id = evt.target.id;
	let [ catId, clueId ] = id.split('-');
	let clue = catQuestions[catId].clueArr[clueId];
	let msg;
	if (!clue.showing) {
		msg = clue.question;
		clue.showing = 'ques';
	} else if (clue.showing === 'ques') {
		msg = clue.answer;
		clue.showing = 'ans';
	} else {
		return;
	}
	$(`#${catId}-${clueId}`).html(msg);
}
async function setupAndStart() {
	await getCategoryIds();
	await getCategory();
	setTimeout('fillTable()', 500);
}
$(async function() {
	setupAndStart();

	$('#jeopardy').on('click', 'td', handleClick);
});

function restart() {
	dogIdArr = [];
	catTitle = [];
	catQuestions = [];
	setupAndStart();
}
$('#restart').on('click', restart);