
// --------------------afficher solde conges and etat -----------------
async function getSoldeConge(){
  
  try{
    const getSolde = await (await fetch("http://localhost:3000/employes")).json();
    const demandes = await (await fetch("http://localhost:3000/demandes")).json();
    const attent = document.getElementById("etatAttent");
    const approv = document.getElementById("etatApprov");
    const refus = document.getElementById("etatRefus");
    const solde_conge = document.getElementById("solde_congs");

    const showSolde = () =>{
      let attente =0;
      let appro =0;
      let refu =0;
      for(let elm of getSolde){
        let emplId = elm.id ===1;
        if(emplId){
        let mesConges = demandes.filter(d => d.employeId === elm.id)
        let congeP = elm.soldeConges;
        let maladie = elm.Congés_maladie;
        let rtt = elm.RTT;
        for(let element of mesConges){
          
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
          solde_conge.innerHTML = `
              <h5>${congeP}</h5>
            `;
          attent.innerHTML = `
              <h5>${attente}</h5>
            `;
          approv.innerHTML = `
              <h5>${appro}</h5>
            `;
          refus.innerHTML = `
              <h5>${refu}</h5>
            `;
        
    
        }
      }
    }
    showSolde()
  }catch(err){
    console.error(err)
  }
}

getSoldeConge()



// ----------------------------------- afficher des conges -----------

async function showConges() {
  const affichConges = document.getElementById("affichConges");
  const getConges = await (await fetch("http://localhost:3000/demandes")).json();

  
  const renderConges = () => {
    affichConges.innerHTML = "";

    getConges.forEach(item => {
      if (item.employeId === 1) {
        let etatHtml = "";
        if (item.etat === "en attente") etatHtml = `<i class="fa-solid fa-clock" style="color:#FF9B2F;"></i> ${item.etat}`;
        else if (item.etat === "approuvé") etatHtml = `<i class="fa-solid fa-check" style="color:#78C841;"></i> ${item.etat}`;
        else if (item.etat === "refusé") etatHtml = `<i class="fa-solid fa-close" style="color:#B22222;"></i> ${item.etat}`;

        affichConges.innerHTML += `
          <div class="row g-3 p-2 align-items-end demande" data-id="${item.id}">
            <div class="col-12 col-md-3">
              <h6 class="d-flex">
                ${item.typeConges} 
                <p class="bg-body-tertiary mx-2 rounded-pill px-2">${etatHtml}</p>
              </h6>
              <p>${item.dateDebut}</p>
              <p>${item.dateFin}</p>
            </div>
            <div class="col-12 col-md-2">
              <p>Durée</p>
              <p>${item.diffDays} jours</p>
            </div>
            <div class="col-12 col-md-2">
              <p>Type</p>
              <p>${item.typeConges}</p>
            </div>
            <div class="col-12 col-md-5 text-md-end">
              <button type="button" class="btn btn-outline-success editBtn" data-id="${item.id}">
                <i class="fa-solid fa-pen-to-square" style="color:#78C841;"></i> Modifier
              </button>
              <button type="button" class="btn btn-outline-danger deleteBtn" data-id="${item.id}">
                <i class="fa-solid fa-trash" style="color:#FB4141;"></i> Supprimer
              </button>
            </div>
          </div>
        `;
      }
    });
  };

  renderConges();

  affichConges.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".editBtn");
    if (editBtn) {
      const demandeId = editBtn.dataset.id;
      const demandeDiv = editBtn.closest(".demande");
      const demande = getConges.find(d => d.id === demandeId);

      demandeDiv.innerHTML = `
        <form class="updateForm">
          <div class="row g-3 p-2 align-items-end">
            <div class="col-12 col-md-3">
              <label>Type Congé</label>
              <input type="text" name="typeConges" value="${demande.typeConges}" class="form-control"/>
            </div>
            <div class="col-12 col-md-3">
              <label>Date Début</label>
              <input type="date" name="dateDebut" value="${demande.dateDebut}" class="form-control"/>
            </div>
            <div class="col-12 col-md-3">
              <label>Date Fin</label>
              <input type="date" name="dateFin" value="${demande.dateFin}" class="form-control"/>
            </div>
            <div class="col-12 col-md-3 text-md-end">
              <button type="submit" class="btn btn-success">Enregistrer</button>
              <button type="button" class="btn btn-secondary cancelBtn">Annuler</button>
            </div>
          </div>
        </form>
      `;


      demandeDiv.querySelector(".updateForm").addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        const updated = {
          ...demande,
          typeConges: formData.get("typeConges"),
          dateDebut: formData.get("dateDebut"),
          dateFin: formData.get("dateFin"),
        };
        updated.diffDays = Math.ceil((new Date(updated.dateFin) - new Date(updated.dateDebut)) / (1000*60*60*24)) + 1;

        await fetch(`http://localhost:3000/demandes/${demandeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        showConges();
      });


      demandeDiv.querySelector(".cancelBtn").addEventListener("click", () => showConges());
    }

    const deleteBtn = e.target.closest(".deleteBtn");
    if(deleteBtn) {
      const demandeId = deleteBtn.dataset.id;
      await fetch(`http://localhost:3000/demandes/${demandeId}`, { method: "DELETE" });
      showConges();
    }
  });
}

showConges();







