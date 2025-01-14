  //////////////////////////////////////////////////////
 //        AFFICHER LES CARDS DES RECETTES           //
//////////////////////////////////////////////////////

const recipesWrapper = document.querySelector('.recipes-container')
let recipesChosenArray = recipes


class RecipeFactory {
    constructor(recipes) {
        this.recipes = recipes
    }

    createRecipeCard() {
        const wrapper = document.createElement('article')
        wrapper.classList.add('recipes')


        const recipeCard = 
        `
			<div class="recipes_top"></div>
			<div class="recipes_bottom">
				<div class="recipes_bottom-title">
					<h2>${this.recipes.name}</h2>
					<div class="recipes_bottom-title--time">
						<i class="fa-solid fa-magnifying-glass"></i>
						<p>${this.recipes.time}min</p>
					</div>			
				</div>

				<div class="recipes_bottom-details">
					<div class="recipes_bottom-details--txt">
						${this.recipes.ingredients.map((ingredient)=>{					
							return `<p>${ingredient.ingredient}: ${ingredient.quantity||""} ${ingredient.unit||""}</p>`;	
						}).join("")}
					</div>
					<div class="recipes_bottom-details--txt description">
						<p>${this.recipes.description}</p>
					</div>
				</div>
			</div>
        `
        wrapper.innerHTML = recipeCard
        return wrapper
    }
}

function displayRecipes(ok) {
    recipesWrapper.innerHTML = "";
    ok.forEach((recipe) => {
		recipesWrapper.appendChild(new RecipeFactory(recipe).createRecipeCard())
    }) 	
}


  ////////////////////////////////////////////////////////////////////////////
 //        AFFICHER LES LISTES INGREDIENTS/APPAREILS/USTENSILES            //
////////////////////////////////////////////////////////////////////////////


let tabIngredients = [...new Set]
let tabAppareils = [...new Set]
let tabUstensiles = [...new Set]

const listeIngredients = document.querySelector(".bouton_liste.ingredients");
const listeAppareils = document.querySelector(".bouton_liste.appareils");
const listeUstensiles = document.querySelector(".bouton_liste.ustensiles");



function initLists(recipes) {
    listeIngredients.innerHTML = "";
    listeAppareils.innerHTML = "";
    listeUstensiles.innerHTML = "";
    tabIngredients = []
    tabAppareils = []
    tabUstensiles = []

    recipes.forEach(recipe => {
        recipe.ingredients.forEach((ingredient) => {
            tabIngredients.push(ingredient.ingredient);
        });
		
        recipe.ustensils.forEach((ustensile) => {
            tabUstensiles.push(ustensile);
        });
        tabAppareils.push(recipe.appliance);
    });

    tabIngredients = [...new Set (tabIngredients)];
    tabUstensiles = [...new Set (tabUstensiles)];
    tabAppareils = [...new Set (tabAppareils)];

    createList(tabIngredients, listeIngredients)
    createList(tabAppareils, listeAppareils)
    createList(tabUstensiles, listeUstensiles)
} 

function createList(tags, container){
    Array.from(tags).sort().forEach((tag) => {
        const p = document.createElement("p");
        p.innerHTML = tag;
        p.setAttribute("tabindex", 0)
        container.appendChild(p);
    })   
}



  //////////////////////////////////////////////////////
 //        OUVERTURE/FERMETURE DES BOUTONS           //
//////////////////////////////////////////////////////




/*
openBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		const dataType = e.target.closest("div").getAttribute("data-type")
		const liste = document.querySelector(`.liste.${dataType}`);
		liste.classList.toggle("active")
		btn.classList.toggle("active")
		btn.lastElementChild.classList.toggle("active") 
	})
})
*/

var openBtn = document.querySelectorAll('.bouton')

openBtn.forEach((btn, index) => {
    let btnTitle = btn.querySelector(".bouton_title")
    btnTitle.addEventListener("click", () => {
        btn.classList.toggle("active")
       
        let btnListe = btn.querySelector(".bouton_liste")

        if(btn.classList.contains("active")){
            btnListe.classList.add("active")
            btnTitle.classList.add("active")     
            btnTitle.lastElementChild.classList.add("active")           
        }

        else{
            btnListe.classList.remove("active")
            btnTitle.classList.remove("active")  
            btnTitle.lastElementChild.classList.remove("active")               
        }

        removeOpen(index)
    })
})

function removeOpen(index1){
    openBtn.forEach((btn, index2) => {
        if(index1 != index2){
            btn.classList.remove("active") 

            let btnListe = btn.querySelector(".bouton_liste")
            let btnTitle = btn.querySelector(".bouton_title")
            btnListe.classList.remove("active")
            btnTitle.classList.remove("active")  
            btnTitle.lastElementChild.classList.remove("active")    
        }
    })
}



  //////////////////////////////////////////////////////
 //        CREATION DES TAGS                         //
//////////////////////////////////////////////////////



var sectionTag = document.querySelector(".section-tag");

function createTag(e){
    const tag = document.createElement("div");
	tag.className = "tag"

    
    tag.innerHTML = 
    `
        <span class="text">${e.target.textContent}</span>
        <i class="far fa-times-circle close-tag" id="close_${e.target.textContent}"></i>
    `
    
    sectionTag.appendChild(tag)
    console.log(e.target.textContent)

    return tag
}

let tagsArrayIngredients = []
let tagsArrayAppareils = []
let tagsArrayUstensiles = []

const liste = Array.from(document.querySelectorAll(".bouton_liste"))
liste.forEach((i) => {
    i.addEventListener("click", (e) => {    
        const tag =  createTag(e) 
        const dataType = i.getAttribute("data-type")
        tag.setAttribute("data-type", `${dataType}`)
        tag.classList.add(dataType)

        if (dataType === "ingredients") {    
            tagsArrayIngredients.push(tag.textContent.trim())                       
            console.log(tagsArrayIngredients)                          
        }
        if (dataType === "appareils") {                          
            tagsArrayAppareils.push(tag.textContent.trim())  
            console.log(tagsArrayAppareils)           
        }
        if (dataType === "ustensiles") {               
            tagsArrayUstensiles.push(tag.textContent.trim())      
            console.log(tagsArrayUstensiles)          
        }   
        closeTag()
        rerollCards()   
    })
})


function closeTag(){
    let tagsClose = document.querySelectorAll(".far.fa-times-circle.close-tag")
    tagsClose.forEach((closer) => {
        closer.addEventListener("click", () => {
            let tagValue = closer.parentElement.textContent.trim()

            let indexIngredients = tagsArrayIngredients.indexOf(tagValue)
            let indexAppareils = tagsArrayAppareils.indexOf(tagValue)
            let indexUstensiles = tagsArrayUstensiles.indexOf(tagValue)

            if (indexIngredients > -1) {
                tagsArrayIngredients.splice(indexIngredients, 1)
            }
            if (indexAppareils > -1) {
                tagsArrayAppareils.splice(indexAppareils, 1)
            }
            if (indexUstensiles > -1) {
                tagsArrayUstensiles.splice(indexUstensiles, 1)
            }
            closer.parentElement.remove()
            rerollCards()
        })
    })
}


function rerollCards() {
    if (tagsArrayIngredients.length === 0 && tagsArrayAppareils.length === 0 && tagsArrayUstensiles.length === 0) {
        displayRecipes(recipes)
        initLists(recipes)
    } 

    else {
        recipesChosenArray = recipes
        if (tagsArrayIngredients.length !== 0) {
            tagsArrayIngredients.forEach((tag) => {               
                recipesChosenArray = recipesChosenArray.filter((recipe) =>                
                    recipe.ingredients.some(ingredient =>                      
                        ingredient.ingredient.toLowerCase().includes(tag.toLowerCase())                       
                    )               
                )
            })
        }

        if (tagsArrayAppareils.length !== 0) {
            tagsArrayAppareils.forEach((tag) => {
                recipesChosenArray = recipesChosenArray.filter((recipe) =>
                    recipe.appliance.toLowerCase().includes(tag.toLowerCase())
                )
            })
        }

        if (tagsArrayUstensiles.length !== 0) {
            tagsArrayUstensiles.forEach((tag) => {
                recipesChosenArray = recipesChosenArray.filter((recipe) =>
                    recipe.ustensils.some(item =>
                        item.toLowerCase().includes(tag.toLowerCase())
                    )
                )
            })
        }
        displayRecipes(recipesChosenArray)
        initLists(recipesChosenArray)
    }
}



///////////////////////////////////////////////////////
//    FILTRE BARRE DE RECHERCHE PRINCIPALE           //
///////////////////////////////////////////////////////


const barreChamp = document.querySelector(".search_bar")

function filtreBarrePrincipale() {
    barreChamp.addEventListener("input", () => {
        let inputValue = barreChamp.value.trim()
   
        if(inputValue.length >= 3){
            recipesChosenArray = recipes.filter(recette => recette.name.toLowerCase().includes(inputValue.toLowerCase()) || 
            recette.description.toLowerCase().includes(inputValue.toLowerCase()) || 
            recette.ingredients.some ((ingredient) => 
            ingredient.ingredient.toLowerCase().includes(inputValue.toLowerCase())))
                     
            displayRecipes(recipesChosenArray)
            initLists(recipesChosenArray)
        }
        
        else{
            init()
        }   
        
        noRecipes()  
    })   
}


///////////////////////////////////////////////////////
//             FILTRE PAR TAGS                       //
///////////////////////////////////////////////////////

const inputIngredients = document.querySelector(".input-ingredients");
const inputAppareils = document.querySelector(".input-appareils");
const inputUstensiles = document.querySelector(".input-ustensiles");


function filtreIngredients(){
    inputIngredients.addEventListener("input", () => {
        const inputBarre = inputIngredients.value;

        if(inputBarre.length >= 1){      
            recipesChosenArray = recipes.filter((recipe) =>                
                recipe.ingredients.some(ingredient =>                      
                    ingredient.ingredient.toLowerCase().includes(inputBarre.toLowerCase())                       
                )               
            ) 
            const searchTagIngredient = tabIngredients.filter((item) => {
                return item.toLowerCase().includes(inputBarre.toLowerCase())           
            }) 

            listeIngredients.innerHTML = "" 
            
            createList(searchTagIngredient, listeIngredients)   
            displayRecipes(recipesChosenArray) 
        }   
        
        else{
            init()
        }   
        
        noRecipes()               
    })
}

function filtreAppareils(){
    inputAppareils.addEventListener("input", () => {
        const inputBarre = inputAppareils.value;
        if (inputBarre.length >= 1) {
            recipesChosenArray = recipes.filter((recipe) =>
                recipe.appliance.toLowerCase().includes(inputBarre.toLowerCase())
            )

            const searchTagAppareil = tabAppareils.filter((item) => {
                return item.toLowerCase().includes(inputBarre.toLowerCase())           
            }) 
            
            listeAppareils.innerHTML = "" 
            
            createList(searchTagAppareil, listeAppareils)    
            displayRecipes(recipesChosenArray)  
        }
       
        if(inputBarre.length == 0){
            init()
        }   
        
        noRecipes()  
    })
}

function filtreUstensiles(){
    inputUstensiles.addEventListener("input", () => {
        const inputBarre = inputUstensiles.value;
        if (inputBarre.length >= 1) {
            recipesChosenArray = recipes.filter((recipe) =>
                recipe.ustensils.some(item =>
                    item.toLowerCase().includes(inputBarre.toLowerCase())
                )
            )

            const searchTagUstensile = tabUstensiles.filter((item) => {
                return item.toLowerCase().includes(inputBarre.toLowerCase())           
            }) 
            
            listeUstensiles.innerHTML = "" 
            
            createList(searchTagUstensile, listeUstensiles)    
            displayRecipes(recipesChosenArray)  
        }
        
        if(inputBarre.length == 0){
            init()
        }   
        
        noRecipes()   
    })    
}

filtreBarrePrincipale()
filtreIngredients()
filtreAppareils()
filtreUstensiles()



function noRecipes(){
    let noRecipes = document.querySelector(".no-recipes")

    if(recipesChosenArray.length == 0){  
        noRecipes.innerHTML = 
    `
        <div class="recipes-container--null">Aucune recette ne correspond à votre recherche.</div>
    `
    }  
}





function init(){
	displayRecipes(recipes)	
	initLists(recipes)
}

init()

