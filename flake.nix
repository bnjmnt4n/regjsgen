{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs?rev=5e871d8aa6f57cc8e0dc087d1c5013f6e212b4ce";
    flake-utils.url = "github:numtide/flake-utils?rev=cfacdce06f30d2b68473a46042957675eebb3401";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages."${system}";
      in {
       devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            nodejs-18_x
            nodePackages.typescript-language-server
          ];
        };
      });
}
