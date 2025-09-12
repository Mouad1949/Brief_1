
const fetchData = async (url) =>
{
  const response = await fetch(url);

  if(!response.ok)
  {
    throw new Error(`data is not fount !! ${url}`)
  }
  return response.json()
}

//  --------------get data of employer-------------------
async function getEmployes()
{
  try
  {
    const getEmpl = await fetchData("http://localhost:3000/employes");
    const demandes = await fetchData("http://localhost:3000/demandes");
    const congePsyes = document.getElementById("congePy");
    const demandeCon = document.getElementById("demandeC");
  
    const showEmployer = () =>
    {
      let attente =0;
      let appro =0;
      let refu =0;
      for(elm of getEmpl){
        let emplId = elm.id ===1;
        if(emplId){
        let mesConges = demandes.filter(d => d.employeId === elm.id)
        let congeP = elm.soldeConges;
        let maladie = elm.Congés_maladie;
        let rtt = elm.RTT;
        for(element of mesConges){
          
          if(element.typeConges == "RTT" ){
            rtt -= element.diffDays;
            }else if(element.typeConges == "Congés payés"){
              congeP -= element.diffDays;
            }else if(element.typeConges == "Congés maladie"){
              maladie -= element.diffDays;
            }
            
            if(element.etat == "en attente"){
              attente++;
            }else if(element.etat == "approuvé"){
              appro++;
            }else if(element.etat == "refusé"){
              refu++;
            }
          }
          congePsyes.innerHTML = `
              <i class="fa-solid fa-calendar-days mb-2 pt-2"></i>
              <p>${congeP} jours</p>
              <p>${rtt} jours</p>
              <p>${maladie} jours</p>
            `;
          demandeCon.innerHTML = `
            <i class="fa-solid fa-clock mb-2 pt-2"></i>
              <p>${attente}</p>
              <p>${appro}</p>
              <p>${refu}</p>
        `;
    
        }
      
        
      
      }
      
    }
    
    showEmployer();
  }
  catch(err)
  {
    console.error(err)
  }
}
getEmployes()


// ----------------------------------get data of notification-----------------------
async function getNotifictions() {
  try{
    const getNotif = await fetchData("http://localhost:3000/notifications");
    let currentIndex = 0; 
    const notifContainer = document.getElementById("dataNotification");

    const notifTitre = document.getElementById("titreN");
    const showNotification = (index) => {
      const element = getNotif[index];
      notifTitre.textContent = element.titre;
      notifContainer.innerHTML = `
      
        <div class="col-sm-12 my-2 bg-body-tertiary rounded-2">
          <h6 class="p-2">
            <i class="fa-solid fa-circle-exclamation"></i> ${element.sujet}
          </h6>
          <p class="p-2">${element.contenu}</p>
        </div>
      `;
    };

    const rightNotification = () => {
      currentIndex--;
      if (currentIndex < 0) currentIndex = getNotif.length - 1;
      showNotification(currentIndex);
    };

    const leftNotification = () => {
      currentIndex++;
      if (currentIndex >= getNotif.length) currentIndex = 0;
      showNotification(currentIndex);
    };

    showNotification(currentIndex);

    document.getElementById("btnRight").addEventListener("click", rightNotification);
    document.getElementById("btnLeft").addEventListener("click", leftNotification);

  }
  catch(error){
    console.error(error)
  }

}
getNotifictions()



// ----------------------------------save data of demandes-----------------------

function diffDays(dateDebut, dateFin) {
  let dDebut = new Date(dateDebut);
  let dFin = new Date(dateFin);

  let diffTime = dFin - dDebut;
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return days;
}

async function saveDemandes()
{
const form = document.getElementById("formData");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  
  const dateDebut = document.getElementById("dateDebut").value;
  const dateFin = document.getElementById("dateFin").value;
  const typeConges = document.getElementById("typeConges").value;
  const justification = document.getElementById("justification").value;
  const lastID = await fetchData("http://localhost:3000/demandes");

  let lastIdemande;
  if (lastID.length > 0) {
  
      lastIdemande = Number(lastID[lastID.length - 1].id) + 1; 
  } else {
      lastIdemande = 1; 
  }
const duree = diffDays(dateDebut, dateFin);
  const newDemande = {
    id:lastIdemande.toString(),
    employeId: 3,     
    dateDebut: dateDebut,
    dateFin: dateFin,
    typeConges: typeConges,
    justification: justification,
    etat: "en attente",
    diffDays:duree    
  };

  // console.log("Données envoyées :", newDemande);
  try {
    const res = await fetch("http://localhost:3000/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDemande)
    });

  } catch (err) {
    console.error(err);
    alert("Impossible de contacter le serveur.");
  }
});
document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
});

}

saveDemandes();


// ---------------------------------get data of demande conges --------------------
async function getDemandes()
{
  try{
    const getDem = await fetchData("http://localhost:3000/demandes");
    const demande = document.getElementById("demande");
    const showDemand = () =>{
      demande.innerHTML = "";
      for(let dem of getDem){
        let idD = dem.employeId === 3;
        
        if(idD){
          demande.innerHTML +=`
            <div class="d-flex justify-content-between">
            <div>
              <h6>${dem.typeConges}</h6>
              <p>${dem.dateDebut} - ${dem.dateFin}</p>
            </div>
            <div>
              <p class="bg-body-tertiary mx-2 rounded-pill px-2"> ${dem.etat}</p>
            </div>
          </div>
          `
        }
      }
    }

    
    showDemand()
  }
  catch(err)
  {
    console.error(err)
  }
}

getDemandes();