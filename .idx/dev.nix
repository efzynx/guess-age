{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.python312
    pkgs.python312Packages.pip
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "start"
          "--"
          # "--port"
          # "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}