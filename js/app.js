/* Your code */
// Create a break line element
var br = document.createElement("br");

function createForm() {

    // Create a form
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("name", "userSurveyForm");
    form.setAttribute("id", "userSurveyFormId");
    form.setAttribute("onsubmit", "foo(this)");

    // Get Question data and convert to json
    fetch('http://localhost:8000/questions').then(res => {
        return res.json()
    }).then(data => {
        data.map(val => {
            // get input type from response and create element accordingly
            var inputType;
            if (val.type === 'text' || val.type === 'email' || val.type === 'number' || val.type === 'rating') {
                inputType = 'input'
            } else if (val.type === 'textarea') {
                inputType = 'textarea'
            } else if (val.type === 'rating') {

            }

            // Create an input element
            var FN = document.createElement(inputType);
            if (inputType) {
                FN.setAttribute("type", val.type);
                FN.setAttribute("placeholder", val.title);
                if (val.mandatory) {
                    FN.setAttribute('Required', val.mandatory);
                }
                if (val.type === 'number') {
                    FN.setAttribute('min', 1111111111);
                    FN.setAttribute('max', 9999999999);
                }
                FN.setAttribute('Class', 'form-control');
                FN.setAttribute('name', val.id);
                FN.setAttribute('id', val.id);
            }

            // if question has answers then make new request to get aptions
            if (val.has_options) {
                fetch('http://localhost:8000/options?question=' + val.id).then(res => {
                    return res.json()
                }).then(optionsData => {
                    optionsData.map(option => {

                        // create the necessary elements
                        var label = document.createElement("label");
                        var description = document.createTextNode(option.label);
                        var checkbox = document.createElement("input");

                        checkbox.type = val.type;    // make the element a checkbox/radio
                        checkbox.name = "slct[]";      // give it a name
                        checkbox.value = option.value;         // value
                        checkbox.setAttribute('class', 'mr5');
                        checkbox.setAttribute('Required', val.mandatory);
                        // if at least one checkbox is checked remove mandatory attribute
                        if (val.type === 'checkbox') checkbox.setAttribute('onchange', "toggleCheckbox(this)");

                        label.appendChild(checkbox);   // add the box to the element
                        label.appendChild(description);// add the description to the element
                        label.setAttribute('class', 'mr ml label-block')
                        if (FN) form.insertBefore(label, FN);
                    })
                }).catch(err => {
                    alert('Unable To Get Question Options');
                })
            }

            if (FN) form.appendChild(FN);
            var itemLabel = document.createElement("Label");
            itemLabel.setAttribute("for", val.id);
            itemLabel.innerHTML = val.title;

            form.insertBefore(itemLabel, FN);
            if (val.type === 'rating') {
                //               var node = document.createElement("div");                 // Create a <li> node
                //               var textnode = document.createTextNode(`<div class="rating">
                //   <span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i>
                // </span><span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span>
                // </div>`);
                //               var d1 = document.get('checkbox');
                //               console.log(d1);
                //  d1.insertAdjacentHTML('beforeend', '<div id="two">two</div>');
                // form.appendChild(node);
                //  document.getElementById("4").appendChild(node);
            }

            form.appendChild(br.cloneNode());


        })
        // create a submit button
        var s = document.createElement("input");
        s.setAttribute("type", "submit");
        s.setAttribute("value", "Submit");

        // Append the submit button to the form
        form.appendChild(s);

        document.getElementById("surveyForm")
            .appendChild(form);

    }).catch(err => {
        alert('Unable To Get Questions');
    })
}

// if at least one checkbox is checked removed required attribute
function toggleCheckbox(element) {
    var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
    if (markedCheckbox.length) {
        let selectedBoxes = document.querySelectorAll('input[type="checkbox"]');
        for (let i = 0; i < selectedBoxes.length; i++) {
            let temp = selectedBoxes[i];
            temp.removeAttribute('required');
        }
    } else {
        let checkBoxes = document.querySelectorAll('input[type="checkbox"]');
        for (let i = 0; i < checkBoxes.length; i++) {
            let temp = checkBoxes[i];
            temp.setAttribute('required', true);
        }
    }
}

window.addEventListener("load", function () {
    createForm();
});

function foo(form) {
    alert("Successfully Submitted.");
    return true;
}
