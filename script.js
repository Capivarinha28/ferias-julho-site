const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const galeriaEl = document.getElementById("galeria");
const carregandoEl = document.getElementById("carregando");

const modalDetalhe = document.getElementById("modalDetalhe");
const modalImagem = document.getElementById("modalImagem");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescricao = document.getElementById("modalDescricao");
const btnVoltar = document.getElementById("btnVoltar");

const modalForm = document.getElementById("modalForm");
const btnAbrirForm = document.getElementById("btnAbrirForm");
const btnCancelarForm = document.getElementById("btnCancelarForm");
const formFoto = document.getElementById("formFoto");
const mensagemForm = document.getElementById("mensagemForm");

// ---------- Carregar fotos do Supabase ----------
async function carregarFotos() {
  const { data, error } = await client
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    carregandoEl.textContent = "Erro ao carregar fotos. Verifique config.js.";
    console.error(error);
    return;
  }

  galeriaEl.innerHTML = "";

  if (!data || data.length === 0) {
    galeriaEl.innerHTML = "<p>Nenhuma foto ainda. Clique em '+ Adicionar foto'.</p>";
    return;
  }

  data.forEach((foto) => {
    const cartao = document.createElement("div");
    cartao.className = "cartao-foto";
    cartao.innerHTML = `
      <img src="${foto.image_url}" alt="${foto.title}" />
      <div class="cartao-texto">
        <h3>${foto.title}</h3>
        <p>${foto.description}</p>
      </div>
    `;
    cartao.addEventListener("click", () => abrirDetalhe(foto));
    galeriaEl.appendChild(cartao);
  });
}

// ---------- Modal de detalhe ----------
function abrirDetalhe(foto) {
  modalImagem.src = foto.image_url;
  modalTitulo.textContent = foto.title;
  modalDescricao.textContent = foto.description;
  modalDetalhe.classList.remove("escondido");
}

btnVoltar.addEventListener("click", () => {
  modalDetalhe.classList.add("escondido");
});

modalDetalhe.addEventListener("click", (e) => {
  if (e.target === modalDetalhe) modalDetalhe.classList.add("escondido");
});

// ---------- Modal de upload ----------
btnAbrirForm.addEventListener("click", () => modalForm.classList.remove("escondido"));
btnCancelarForm.addEventListener("click", () => modalForm.classList.add("escondido"));

formFoto.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagemForm.textContent = "Enviando...";

  const titulo = document.getElementById("inputTitulo").value.trim();
  const categoria = document.getElementById("inputCategoria").value;
  const descricao = document.getElementById("inputDescricao").value.trim();
  const arquivo = document.getElementById("inputArquivo").files[0];

  if (!arquivo) {
    mensagemForm.textContent = "Escolha uma foto.";
    return;
  }

  try {
    // 1) Sobe a imagem no Storage
    const nomeArquivo = `${Date.now()}-${arquivo.name}`;
    const { error: erroUpload } = await client.storage
      .from("fotos")
      .upload(nomeArquivo, arquivo);

    if (erroUpload) throw erroUpload;

    // 2) Pega a URL pública da imagem
    const { data: urlData } = client.storage.from("fotos").getPublicUrl(nomeArquivo);

    // 3) Insere a linha na tabela photos (isso é o que o app também vai ler)
    const { error: erroInsert } = await client.from("photos").insert({
      title: titulo,
      description: descricao,
      category: categoria,
      image_url: urlData.publicUrl,
    });

    if (erroInsert) throw erroInsert;

    mensagemForm.style.color = "#16a34a";
    mensagemForm.textContent = "Foto adicionada com sucesso!";
    formFoto.reset();
    await carregarFotos();

    setTimeout(() => {
      modalForm.classList.add("escondido");
      mensagemForm.textContent = "";
      mensagemForm.style.color = "#dc2626";
    }, 1200);
  } catch (err) {
    console.error(err);
    mensagemForm.textContent = "Erro ao enviar. Tente novamente.";
  }
});

carregarFotos();
