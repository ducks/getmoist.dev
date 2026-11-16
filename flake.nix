{
  description = "Moist static website development and offline build checks";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      each = nixpkgs.lib.genAttrs systems;
    in {
      devShells = each (system:
        let pkgs = import nixpkgs { inherit system; };
        in { default = pkgs.mkShell { packages = [ pkgs.nodejs_24 pkgs.gnumake pkgs.git ]; }; });
      packages = each (system:
        let pkgs = import nixpkgs { inherit system; };
        in { default = pkgs.stdenvNoCC.mkDerivation {
          pname = "moist-site";
          version = "1.0.0";
          src = self;
          nativeBuildInputs = [ pkgs.nodejs_24 ];
          buildPhase = "node scripts/build.mjs";
          doCheck = true;
          checkPhase = "node --test tests/*.test.mjs";
          installPhase = "cp -r dist $out";
        }; });
      checks = each (system: { static-site = self.packages.${system}.default; });
    };
}
