async function showCongeStats() {
  try {

    const res = await fetch("http://localhost:3000/demandes");
    const demandes = await res.json();

    
    let attente = 0;
    let appro = 0;
    let refu = 0;

    for (const element of demandes) {
      if (element.etat === "en attente") {
        attente++;
      } else if (element.etat === "approuvé") {
        appro++;
      } else if (element.etat === "refusé") {
        refu++;
      }
    }

    document.querySelector("#enAttente h5").innerText = attente;
    document.querySelector("#allAppro h5").innerText = appro;
    document.querySelector("#refuse h5").innerText = refu;
    document.querySelector("#total h5").innerText = demandes.length;

  } catch (err) {
    console.error(err);
    alert("Erreur fetching demandes");
  }
}


showCongeStats();


async function filterDemandes() {
  const resEmployes = await fetch("http://localhost:3000/employes");
  const employes = await resEmployes.json();

  const resDemandes = await fetch("http://localhost:3000/demandes");
  const demandes = await resDemandes.json();

  const container = document.getElementById("demandesContainer");
  const filterSelect = document.getElementById("filterSelect");
  const filterBtn = document.getElementById("filterBtn"); // ✅ button جديد

  function render(selectedEtat = "all", onlyLast = false) {
    container.innerHTML = ""; 

    for (const emp of employes) {
      let userDemandes = demandes.filter(d => d.employeId === emp.id);

      if (selectedEtat !== "all") {
        userDemandes = userDemandes.filter(d => d.etat === selectedEtat);
      }

      if (userDemandes.length === 0) continue;

      if (onlyLast) {
        userDemandes = [
          userDemandes.reduce((latest, current) => {
            return new Date(current.dateDebut) > new Date(latest.dateDebut)
              ? current
              : latest;
          })
        ];
      }

      for (const item of userDemandes) {
        const etatHtml = item.etat === "en attente"
          ? "En attente"
          : item.etat === "approuvé"
          ? "Approuvé"
          : "Refusé";

        container.innerHTML += `
        <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="border rounded-2 p-2 mb-3">
            <div class="d-flex justify-content-between p-2">
              <div class="d-flex">
                <div><img class="image" src="./images/man (1).png" alt="image 1"></div>
                <div class="d-flex flex-column ms-2">
                  <h6>${emp.nom}</h6>
                  <p>${emp.poste}</p>
                </div>
              </div>
              <div>
                <p class="bg-body-tertiary rounded-pill px-3 m-2">${etatHtml}</p>
              </div>
            </div>
            <div class="d-flex justify-content-between p-2">
              <div>
                <p>Type: </p>
                <p>Du: </p>
                <p>Au: </p>
                <p>Durée: </p>
                <button type="button" class="btn btn-success approveBtn" data-id="${item.id}">
                  <i class="fa-solid fa-check" style="color: #a3e7cc;"></i> Approuvé
                </button>
              </div>
              <div>
                <p>${item.typeConges}</p>
                <p>${item.dateDebut}</p>
                <p>${item.dateFin}</p>
                <p>${item.diffDays} jours</p>
                <button type="button" class="btn border border-danger refuseBtn" data-id="${item.id}">
                  <i class="fa-solid fa-circle-xmark" style="color: #FB4141;"></i> Refusé
                </button>
              </div>
            </div>
          </div>
        </div>
        `;
      }
    }
  }


  filterSelect.addEventListener("change", () => {
    const selected = filterSelect.value;
    render(selected);
  });


  filterBtn.addEventListener("click", () => {
    const selected = filterSelect.value;
    render(selected, true);
  });


  container.addEventListener('click', async function(e) {
    const approveBtn = e.target.closest('.approveBtn');
    const refuseBtn = e.target.closest('.refuseBtn');
    if (!approveBtn && !refuseBtn) return;

    const id = (approveBtn || refuseBtn).dataset.id;
    const demandeToUpdate = demandes.find(d => d.id == id);
    if (!demandeToUpdate) return;

    if (demandeToUpdate.etat !== "en attente") {
      alert("Cette demande ne peut pas être modifiée !");
      return;
    }

    demandeToUpdate.etat = approveBtn ? "approuvé" : "refusé";

    try {
      const res = await fetch(`http://localhost:3000/demandes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demandeToUpdate)
      });
      if (!res.ok) throw new Error("Erreur update");
      render(filterSelect.value); 
    } catch (err) {
      console.error(err);
      console.log("Erreur lors de la modification de la demande");
    }

    render(filterSelect.value); 
  });

  render();
}

filterDemandes();
