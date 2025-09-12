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
  let lastIdemande = 0;

  if (lastID.length > 0) {
    lastIdemande = lastID[lastID.length - 1].id + 1; 
  } else {
    lastIdemande = 1; 
  }
const duree = diffDays(dateDebut, dateFin);
  const newDemande = {
    id:lastIdemande,
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

    if (res.ok) {
      alert("Demande de conge envoyee avec succes !");
      form.reset(); 
    } else {
      alert("Erreur lors de l'envoi de la demande.");
    }
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